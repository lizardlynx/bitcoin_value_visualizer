'use strict';

const minDates = {
  'USD': '2011-08-17',
  'UAH': '2017-03-17',
};

//monthes in parse time
const monthes = ['Jan', 'Feb', 'March',
  'Apr', 'May', 'June',
  'July', 'Aug', 'Sept',
  'Oct', 'Nov', 'Dec'];

//this function updates max allowed dates
function updateMaxDate() {
  const period = document.getElementsByClassName('submit');
  const startDate = period[0];
  const endDate = period[1];
  startDate.max = new Date().toISOString().split('T')[0];
  endDate.max = new Date().toISOString().split('T')[0];
}

//function for parsing time for better visuals
function parseTime(time) {
  const date = time.split('T')[0];
  const ymd = date.split('-');
  const month = monthes[ymd[1] - 1];
  return ymd[2] + ' ' + month + ' ' + ymd[0];
}

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
