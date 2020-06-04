/* eslint-disable no-undef */
'use strict';

//executing when dom content loaded
document.addEventListener('DOMContentLoaded', () => {
  updateMaxDate();
  const submitButton = document.getElementById('submit');

  //handling page when clicking submit button
  submitButton.addEventListener('click', event => {
    event.preventDefault();
    const errorSect = document.getElementById('error');
    errorSect.style.visibility = 'hidden';
    const divStart = document.getElementById('wrong-input-start');
    const divEnd = document.getElementById('wrong-input-end');
    divStart.style.visibility = 'hidden';
    divEnd.style.visibility = 'hidden';

    //finding dates user inputs
    const period = document.getElementsByClassName('submit');
    const startDate = period[0].value;
    const endDate = period[1].value;

    const currencies = document.getElementsByClassName('currency');
    for (let i = 0; i < currencies.length; i++) {
      if (currencies[i].checked === true) {
        currency = currencies[i].id;
      }
    }

    //checking if format is right
    const dates = checkDate(startDate, endDate);

    //if right create chart else show error div
    if (dates) {
      const loadGif = document.getElementsByClassName('load')[0];
      loadGif.style.visibility = 'visible';
      getData(dates[0], dates[1], currency);
    } else {
      console.log(dates + ' format of date input');
    }
  });
});

//function for "GET"ing data
function getData(dateStart, dateEnd, currency) {
  loadData('GET', `/?${dateStart}?${dateEnd}?${currency}`, null, data => {
    updateChart(data);
  });
}

//when "GET" gets information from server
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
