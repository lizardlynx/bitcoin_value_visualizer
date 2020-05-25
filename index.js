'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');

//this function asyncronously reads file 
function readFile (file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) console.log(err);
      try {
        resolve(data);
      } catch (err) {
        reject(err.message);
      }
    });
  });
};

//this function asyncronously checkes if file exists
function existsFile (file) {
  return new Promise((resolve, reject) => {
    fs.exists(file, (exists) => {
      try {
        resolve(exists);
      } catch (err) {
        reject(err.message);
      }
    });
  });
};

//types of requests
const routing = {
  '/': 
                {'fn': () => readFile('main.html'),
                'type': 'text/html'},
  '/js/main.js': 
                {'fn': () => readFile('./js/main.js'),
                'type': 'text/javascript'},
  '/date': 
                {'fn': (str) => {
                  const data = str.split('?');
                  const dateStart = data[1];
                  const dateEnd = data[2];
                  const currency = data[3];
                  const key = dateStart + "&" + dateEnd + "&" + currency;
                  const dataBTC = researchCache(key);
                  return dataBTC;
                },
                'type': 'text/plain'},
  '/css/style.css':  
                {'fn': () => readFile('./css/style.css'),
                'type': 'text/css'},
  '/js/canvas.js':  
                {'fn': () => readFile('./js/canvas.js'),
                'type': 'text/javascript'},
  '/js/chart.js': 
                {'fn': () => readFile('./js/chart.js'),
                'type': 'text/javascript'},
}

//handling rejections in promises
process.on('unhandledRejection', error => {
  console.log('rejection: ', error);
});

process.on('rejectionHandled', promise => {
  console.log('rejection handled: ' + promise);
});

//options for grabber
const options = {
  headers: {
    'X-CoinAPI-Key': 'DCA96673-BC62-4606-95C7-44FC5B657F21',
  }
}


//grabber for cryptocurrencies
function grabber(dateStart, dateEnd, currency) {

  return new Promise((resolve, reject) => {

  /*    
    resolve(JSON.stringify([
      {
        time_open: '2019-05-15',
        price_close: 7000,
      },
      {
        time_open: '2019-05-16',
        price_close: 12000,
      },
      {
        time_open: '2019-05-17',
        price_close: 8000,
      },
      {
        time_open: '2019-05-18',
        price_close: 7000,
      },
    ])); */
    
    https.get(`https://rest.coinapi.io/v1/ohlcv/BTC/${currency}/history?period_id=1DAY&time_start=${dateStart}T00:00:00&time_end=${dateEnd}T00:00:00&limit=100000&include_empty_items=false`, options, (res) => {
      const { statusCode } = res;
      console.log(statusCode);

      let result = '';

      res.on('data', (chunk) => {
        result += chunk;
        console.log('+');
      }).on('end', () => {
        try {
          resolve(result);
          console.log(result);
        } catch (err) {
          reject(err.message);
        }
      });
    });

  });

};

//cache function
async function researchCache(key) {
  const exists = await existsFile(`./cache/${key}.json`);
  if (exists) {
    const cache = await readFile(`./cache/${key}.json`);
    return cache;
  } else {
    const data = key.split('&');
    const dateStart = data[0];
    const dateEnd = data[1];
    const currency = data[2];
    const dataBTC = await grabber(dateStart, dateEnd, currency);
    fs.writeFile(`./cache/${key}.json`, dataBTC, (err) => {
      if (err) console.log(err);
    });
    return dataBTC;
  }
};

//function for handling requests
async function handleRequest (req, res) {
  const method = req.method;
  let url = req.url;
  const info = url;
  console.log(url);
  if (method === 'GET') {
    if (url[1] == '?') {
      url = '/date';
    }
    const result = routing[url];
    if (result !== undefined) {
      const func = result['fn'];
      const typeAns = result['type'];
      const data = await func(info);
      res.writeHead(200, { 'Content-Type': `${typeAns}; charset=utf-8`});
      res.end(data);
    }    
  } else if (method === 'POST') {
    console.log('POST');
  }
};


//creating server
const server = http.createServer();

server.listen(8080, () => {
  console.log('Server running on port 8080...');
});

server.on('request', handleRequest);


