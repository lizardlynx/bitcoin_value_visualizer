'use strict';

const bitcoinCost = [];

document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit');
  
  submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    const period = document.getElementsByClassName('submit');
    const startDate = period[0].value;
    let endDate = period[1].value;
    const endParsed = endDate.split('-');
    endParsed[2]++;
    endDate = endParsed.join('-');

    getData(startDate, endDate);
  });
});

//manipulations with data we get from function getData()
function updateChart (data) {
  const bitcoinData = JSON.parse(data);
  console.log(bitcoinData);
  for (let day of bitcoinData) {
    const dataByDay = { day: day.time_open,
                       price: day.price_close };
    bitcoinCost.push(dataByDay);
  }
  
}

//if "POST" posts data on browser, if "GET" gets information from server 
function loadData (method, url, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(xhr.response);
    }
  }
  xhr.open(method, url, true);
  xhr.responseType = 'text';
  if (method == 'POST') {
    xhr.send(data);
  } else {
    xhr.send();
  }
}

//function for "GET"ing data
function getData (dateStart, dateEnd) {
  const limit = '105';

  loadData ('GET', `/?${dateStart}?${dateEnd}?${limit}`, null, data => {
    updateChart(data);
  });
    
};

//function for "POST"ing data
function sendData () {
  const data = 'smth';
  loadData('POST', 'http://localhost:3000/api', data, (data) => {
    console.log(data);
  });
};
