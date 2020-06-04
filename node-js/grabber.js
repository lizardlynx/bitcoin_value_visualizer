'use strict';

const https = require('https');

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

module.exports = { grabber };
