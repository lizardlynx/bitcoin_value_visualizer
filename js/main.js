/* eslint-disable no-unused-vars */
'use strict';

// eslint-disable-next-line prefer-const
let bitcoinCost = [];
let currency = 'USD';
const minDates = {
  'USD': '2011-08-17',
  'UAH': '2011-08-17',
};

//checks if inserted dates are okay shows div if wrong and styling
function checkDate(start, end) {

  //variables for dates
  const divStart = document.getElementById('wrong-input-start');
  const divEnd = document.getElementById('wrong-input-end');
  divStart.style.visibility = 'hidden';
  divEnd.style.visibility = 'hidden';
  const date = new Date();
  const minDate = minDates[currency];
  const dateToday = date.getUTCFullYear() + '-' +
    (date.getMonth() + 1) + '-' + date.getDate();

  //finding timestamps
  const startDate = start.split('-').join(' ');
  const endDate = end.split('-').join(' ');
  const minTimestamp = +(new Date(minDate));
  const maxTimestamp = +(date);
  const startTimestamp = +(new Date(startDate));
  const endTimestamp = +(new Date(endDate));

  //checking dates and styling error div
  if (startTimestamp >= endTimestamp) {
    divStart.style.visibility = 'visible';
    divEnd.style.visibility = 'visible';
    divStart.innerText = 'Start date should be less than the end date.';
    divEnd.innerText = 'Start date should be less than the end date.';
    return false;
  } else if (isNaN(startTimestamp) && !isNaN(endTimestamp)) {
    divStart.style.visibility = 'visible';
    divStart.innerText = 'Please insert starting date.';
    return false;
  } else if (isNaN(endTimestamp) && !isNaN(startTimestamp)) {
    divEnd.style.visibility = 'visible';
    divEnd.innerText = 'Please insert ending date.';
    return false;
  } else if (isNaN(startTimestamp) && isNaN(endTimestamp)) {
    divStart.style.visibility = 'visible';
    divStart.innerText = 'Please insert starting date.';
    divEnd.style.visibility = 'visible';
    divEnd.innerText = 'Please insert ending date.';
    return false;
  } else if (minTimestamp > startTimestamp) {
    const inf = `Minimal date you can enter is ${minDates[currency]}`;
    divStart.style.visibility = 'visible';
    divStart.innerText = inf;
    return false;
  } else if (minTimestamp > endTimestamp) {
    const inf = `Minimal date you can enter is at least ${minDates[currency]}`;
    divEnd.style.visibility = 'visible';
    divEnd.innerText = inf;
    return false;
  } else if (maxTimestamp < startTimestamp) {
    const inf = `Maximal date you can enter is at least ${dateToday}`;
    divStart.style.visibility = 'visible';
    divStart.innerText = inf;
    return false;
  } else if (maxTimestamp < endTimestamp) {
    const inf = `Maximal date you can enter is ${dateToday}`;
    divEnd.style.visibility = 'visible';
    divEnd.innerText = inf;
    return false;
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

//executing when dom content loaded
document.addEventListener('DOMContentLoaded', () => {
  updateMaxDate();
  const submitButton = document.getElementById('submit');

  //handling page when clicking submit button
  submitButton.addEventListener('click', event => {
    event.preventDefault();
    const errorSect = document.getElementById('error');
    errorSect.style.visibility = 'hidden';

    //finding dates user inputs
    const period = document.getElementsByClassName('submit');
    const startDate = period[0].value;
    let endDate = period[1];
    const endParsed = endDate.value.split('-');
    endDate = endParsed.join('-');

    //checking if format is right
    const correctFormat = checkDate(startDate, endDate);

    //if right create chart else show error div
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
      console.log(correctFormat + ' format of date input');
    }
  });
});

//manipulations with data we get from function getData()
function updateChart(data) {
  try {
    const bitcoinData = JSON.parse(data);
    console.log(bitcoinData);
    for (const day of bitcoinData) {
      const dataByDay = { day: day.time_open,
        price: day.price_close };
      bitcoinCost.push(dataByDay);
    }
  } catch (err) {
    if (typeof data === 'string') {
      const loadGif = document.getElementsByClassName('load')[0];
      loadGif.style.visibility = 'hidden';
      const errorSect = document.getElementById('error');
      errorSect.innerText = data;
      errorSect.style.visibility = 'visible';
      console.log(data);
    } else {
      console.log(err);
    }
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
