'use strict';

const http = require('http');
const fs = require('fs');
const {existsFile, readFile} = require('./js/fileFuncs.js');
const {grabber} = require('./js/grabber.js');

//types of request extensions
const memo = {
  'html': 'text/html',
  'js': 'text/javascript',
  'css': 'text/css',
  'png': 'image/png',
  'ico': 'image/x-icon',
  '/date': 'text/plain',
};

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

//handling rejections in promises
process.on('unhandledRejection', error => {
  console.log('rejection: ', error);
});

process.on('rejectionHandled', promise => {
  console.log('rejection handled: ' + promise);
});
