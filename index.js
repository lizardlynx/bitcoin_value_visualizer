'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');

//types of request extensions
const memo = {
  'html': 'text/html',
  'js': 'text/javascript',
  'css': 'text/css',
  'png': 'image/png',
  'ico': 'image/x-icon',
  '/date': 'text/plain',
};

//handling rejections in promises
process.on('unhandledRejection', error => {
  console.log('rejection: ', error);
});

process.on('rejectionHandled', promise => {
  console.log('rejection handled: ' + promise);
});

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

//this function asyncronously reads file
function readFileInfo(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) console.log('err in readFileInfo: ' + err);
      try {
        resolve(data);
      } catch (err) {
        reject(err.message);
      }
    });
  });
}

//handling rejections in readFileInfo
async function readFile(file) {
  try {
    const data = await readFileInfo(file);
    return data;
  } catch (err) {
    console.log('this error occured in readFile => ' + err);
    return false;
  }
}

//get parameters passed by user
function getDataBTC(str) {
  const data = str.split('?');
  const dateStart = data[1];
  const dateEnd = data[2];
  const currency = data[3];
  const key = dateStart + '&' + dateEnd + '&' + currency;
  const dataBTC = researchCache(key);
  return dataBTC;
}

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
        if (statusCode !== 200) {
          console.log('in grabber => ' + result);
          reject(statusCode);
        } else {
          resolve(result);
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
    try {
      const dataBTC = await grabber(dateStart, dateEnd, currency);
      fs.writeFile(`./cache/${key}.json`, dataBTC, err => {
        if (err) console.log('error in writeFile in researchCache => ' + err);
      });
      return dataBTC;
    } catch (err) {
      console.log('error in researchCache => ' + err);
      return err;
    }
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
      name = '/main.html';
    }
    let data = null;
    const typeAns = memo[extention];
    if (extention === '/date') {
      data = await getDataBTC(name);
    } else {
      data = await readFile('.' + name);
    }
    if (!data) {
      console.log('no such file => ' + name);
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.write('No such page found');
    } else if (typeof data === 'number') {
      console.log('error occured => ' + name);
      console.log(data);
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      if (data === 429) {
        res.write('Too many requests');
      }
    } else {
      res.writeHead(200, { 'Content-Type': `${typeAns}; charset=utf-8` });
      res.write(data);
    }
    res.end();

  } else if (method === 'POST') {
    console.log('POST');
  }
}

//creating server
const server = http.createServer();

server.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port ...');
});

server.on('request', handleRequest);
