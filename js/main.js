/* eslint-disable no-unused-vars */
'use strict';

//this function checks if inserted dates are okay
function checkDate(start, end) {
  const startDate = start.split('-').join(' ');
  const endDate = end.split('-').join(' ');
  const startTimestamp = +(new Date(startDate));
  const endTimestamp = +(new Date(endDate));
  if (startTimestamp >= endTimestamp) {
    return 'Start date should be less than the end date.';
  } else if (isNaN(startTimestamp)) {
    return 'Please insert starting date.';
  } else if (isNaN(endTimestamp)) {
    return 'Please insert ending date.';
  } else return true;
}

//this function updates max allowed dates
function updateMaxDate() {
  const period = document.getElementsByClassName('submit');
  const startDate = period[0];
  const endDate = period[1];
  startDate.max = new Date().toISOString().split('T')[0];
  endDate.max = new Date().toISOString().split('T')[0];
}

// eslint-disable-next-line prefer-const
let bitcoinCost = [];
let currency = 'USD';

document.addEventListener('DOMContentLoaded', () => {

  updateMaxDate();

  const submitButton = document.getElementById('submit');

  submitButton.addEventListener('click', event => {
    event.preventDefault();

    const period = document.getElementsByClassName('submit');
    let startDate = period[0];
    let endDate = period[1];

    startDate = startDate.value;
    const endParsed = endDate.value.split('-');
    endDate = endParsed.join('-');

    const correctFormat = checkDate(startDate, endDate);
    console.log(correctFormat);
    if (correctFormat === true) {
      const loadGif = document.getElementsByClassName('load')[0];
      loadGif.style.visibility = 'visible';
      const currencies = document.getElementsByClassName('currency');
      for (let i = 0; i < currencies.length; i++) {
        if (currencies[i].checked === true) {
          currency = currencies[i].id;
        }
      }
      getData(startDate, endDate, currency);
    } else {
      console.log(correctFormat);
    }
  });
});

//manipulations with data we get from function getData()
function updateChart(data) {
  const bitcoinData = JSON.parse(data);
  console.log(bitcoinData);
  for (const day of bitcoinData) {
    const dataByDay = { day: day.time_open,
      price: day.price_close };
    bitcoinCost.push(dataByDay);
  }

}

//if "POST" posts data on browser, if "GET" gets information from server
function loadData(method, url, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(xhr.response);
    }
  };
  xhr.open(method, url, true);
  xhr.responseType = 'text';
  if (method === 'POST') {
    xhr.send(data);
  } else {
    xhr.send();
  }
}

//function for "GET"ing data
function getData(dateStart, dateEnd, currency) {

  loadData('GET', `/?${dateStart}?${dateEnd}?${currency}`, null, data => {
    updateChart(data);
  });

}

//function for "POST"ing data
function sendData() {
  const data = 'smth';
  loadData('POST', 'http://localhost:3000/api', data, data => {
    console.log(data);
  });
}
