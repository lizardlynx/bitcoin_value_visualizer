'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');

//this function asyncronously reads file
function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) console.log(err);
      try {
        resolve(data);
      } catch (err) {
        reject(err.message);
      }
    });
  });
}

//this function asyncronously checkes if file exists
function existsFile(file) {
  return new Promise((resolve, reject) => {
    fs.exists(file, exists => {
      try {
        resolve(exists);
      } catch (err) {
        reject(err.message);
      }
    });
  });
}

//types of request extensions
const routing = {
  'html':
                { 'fn': file => readFile('./' + file),
                  'type': 'text/html' },
  'js':
                { 'fn': file => readFile('./' + file),
                  'type': 'text/javascript' },
  '/date':
                { 'fn': str => {
                  const data = str.split('?');
                  const dateStart = data[1];
                  const dateEnd = data[2];
                  const currency = data[3];
                  const key = dateStart + '&' + dateEnd + '&' + currency;
                  const dataBTC = researchCache(key);
                  return dataBTC;
                },
                'type': 'text/plain' },
  'css':
                { 'fn': file => readFile('./' + file),
                  'type': 'text/css' },
  'png':
               { 'fn': file => readFile('./' + file),
                 'type': 'image/png' },
};

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
};


//grabber for cryptocurrencies
function grabber(dateStart, dateEnd, currency) {

  return new Promise((resolve, reject) => {

    https.get(`https://rest.coinapi.io/v1/ohlcv/BTC/${currency}/history?period_id=1DAY&time_start=${dateStart}T00:00:00&time_end=${dateEnd}T00:00:00&limit=100000&include_empty_items=false`, options, res => {
      const { statusCode } = res;
      console.log(statusCode);

      let result = '';

      res.on('data', chunk => {
        result += chunk;
        console.log('+');
      }).on('end', () => {
        try {
          resolve(result);
        } catch (err) {
          reject(err.message);
        }
      });
    });

  });

}

//cache function
async function researchCache(key) {
  const exists = await existsFile(`./cache/${key}.json`);
  if (exists) {
    console.log('from cache');
    const cache = await readFile(`./cache/${key}.json`);
    return cache;
  } else {
    const data = key.split('&');
    const dateStart = data[0];
    const dateEnd = data[1];
    const currency = data[2];
    const dataBTC = await grabber(dateStart, dateEnd, currency);
    fs.writeFile(`./cache/${key}.json`, dataBTC, err => {
      if (err) console.log(err);
    });
    return dataBTC;
  }
}

//function for handling requests
async function handleRequest(req, res) {
  const url = req.url;
  let name = url;
  const method = req.method;
  let extention = url.split('.')[1];
  console.log(url);

  if (method === 'GET') {
    if (url[1] === '?') {
      extention = '/date';
    } else if (url === '/') {
      extention = 'html';
      name = 'main.html';
    }
    const result = routing[extention];
    if (result !== undefined) {
      const func = result['fn'];
      const typeAns = result['type'];
      const data = await func(name);

      res.writeHead(200, { 'Content-Type': `${typeAns}; charset=utf-8` });
      res.write(data);
      res.end();
    }
  } else if (method === 'POST') {
    console.log('POST');
  }
}


//creating server
const server = http.createServer();

server.listen(8080, () => {
  console.log('Server running on port 8080...');
});

server.on('request', handleRequest);


