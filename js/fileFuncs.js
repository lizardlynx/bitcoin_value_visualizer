'use strict';

const fs = require('fs');

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

module.exports = {existsFile, readFile};