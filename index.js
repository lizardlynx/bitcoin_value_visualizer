'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');

//this function asyncronously reads file 
function readFile (file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      try {
        resolve(data);
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
                'type': 'html'},
  '/js/main.js': 
                {'fn': () => readFile('./js/main.js'),
                'type': 'javascript'},
  '/date': 
                {'fn': async(str) => {
                  const data = str.split('?');
                  const dateStart = data[1];
                  const dateEnd = data[2];
                  const limit = data[3];
                  const dataBTC = await grabber(dateStart, dateEnd, limit);
                  return dataBTC;
                },
                'type': 'plain'},
  '/css/style.css':  
                {'fn': () => readFile('./css/style.css'),
                'type': 'css'},
  '/js/canvas.js':  
                {'fn': () => readFile('./js/canvas.js'),
                'type': 'javascript'},
  '/js/chart.js': 
                {'fn': () => readFile('./js/chart.js'),
                'type': 'javascript'},
}

//handling rejections in promises
process.on('unhandledRejection', error => {
  console.log('rejection: ', error.message);
});

process.on('rejectionHandled', promise => {
  console.log('rejection handled: ' + promise);
});

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
      res.writeHead(200, { 'Content-Type': `text/${typeAns}; charset=utf-8`});
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


//options for grabber
const options = {
  headers: {
    'X-CoinAPI-Key': 'DCA96673-BC62-4606-95C7-44FC5B657F21',
  }
}


//grabber for cryptocurrencies
function grabber(dateStart, dateEnd, limit) {

  return new Promise((resolve, reject) => {

    
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
    ])); 
    /*
    https.get(`https://rest.coinapi.io/v1/ohlcv/BTC/USD/history?period_id=1DAY&time_start=${dateStart}T00:00:00&time_end=${dateEnd}T00:00:00&limit=${limit}&include_empty_items=false`, options, (res) => {
      const { statusCode } = res;
      console.log(statusCode);

      let result = '';

      res.on('data', (chunk) => {
        result += chunk;
        console.log('+');
      }).on('end', () => {
        try {
          resolve(result);
        } catch (err) {
          reject(err.message);
        }
      });
    });*/

  });

};
