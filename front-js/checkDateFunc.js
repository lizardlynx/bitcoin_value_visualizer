'use strict';

const minDates = {
  'USD': '2011-08-17',
  'UAH': '2011-08-17',
};

//this function updates max allowed dates
function updateMaxDate() {
  const period = document.getElementsByClassName('submit');
  const startDate = period[0];
  const endDate = period[1];
  startDate.max = new Date().toISOString().split('T')[0];
  endDate.max = new Date().toISOString().split('T')[0];
}

//function swaps dates when input is not correct
function swapTime(startDate, endDate) {
  const calendars = document.getElementsByClassName('submit');
  const calendarStart = calendars[0].value = endDate;
  const calendarEnd = calendars[1].value = startDate;
}

function setTime(index) {
  const minDate = minDates[currency];
  const date = new Date();
  let month = (date.getUTCMonth() + 1).toString();
  let day = (date.getUTCDate()).toString();
  if (month.length !== 2) {
    month = '0' + month;
  }
  if(day.length !== 2) {
    day = '0' + day;
  }
  const dateToday = date.getUTCFullYear() + '-' + month + '-' + day;
  let value = minDate;
  if (index === 0) {
    value = minDate;
  } else value = dateToday;
  const calendars = document.getElementsByClassName('submit');
  const calendar = calendars[index].value = value;
}

//checks if inserted dates are okay shows div if wrong and styling
function checkDate(start, end) {

  //variables for dates
  const divStart = document.getElementById('wrong-input-start');
  const divEnd = document.getElementById('wrong-input-end');
  const date = new Date();
  const minDate = minDates[currency];
  let month = (date.getUTCMonth() + 1).toString();
  let day = (date.getUTCDate()).toString();
  if (month.length !== 2) {
    month = '0' + month;
  }
  if(day.length !== 2) {
    day = '0' + day;
  }
  const dateToday = (date.getUTCFullYear() + '-' + month + '-' + day);

  //finding timestamps
  const minTimestamp = new Date(minDate).getTime();
  const maxTimestamp = +(new Date(dateToday));
  let startTimestamp = new Date(start).getTime();
  let endTimestamp = +(new Date(end));

  //checking dates and styling error div

  //if time is swaped backwards
  if (startTimestamp > endTimestamp) {
    divStart.style.visibility = 'visible';
    divEnd.style.visibility = 'visible';
    swapTime(start, end);
    const temp = start;
    start = end;
    end = start;
    startTimestamp = +(new Date(start));
    endTimestamp = +(new Date(end));
  } 
  
  //if start and end are the same day
  if (startTimestamp === endTimestamp) {
    divStart.style.visibility = 'visible';
    divEnd.style.visibility = 'visible';
    const info = 'difference between start and end should be at least 1 day';
    divStart.innerText = info;
    divEnd.innerText = info;
    return false;
  }

  //if dates are not inserted
  if (isNaN(startTimestamp) && isNaN(endTimestamp)) {
    divStart.style.visibility = 'visible';
    divEnd.style.visibility = 'visible';
    setTime(0);
    setTime(1);
    start = minDate;
    end = dateToday;
    startTimestamp = +(new Date(start));
    endTimestamp = +(new Date(end));
  } else if (isNaN(startTimestamp)) {
    divStart.style.visibility = 'visible';
    setTime(0);
    start = minDate;
    startTimestamp = +(new Date(start));
  } else if (isNaN(endTimestamp)) {
    divEnd.style.visibility = 'visible';
    setTime(1);
    end = dateToday;
    endTimestamp = +(new Date(end));
  }
  
  //if in input dates there are no bitcoin values
  if ((minTimestamp > startTimestamp && minTimestamp >= endTimestamp) ||
   (maxTimestamp <= startTimestamp && maxTimestamp < endTimestamp) ||
   (minTimestamp > startTimestamp && maxTimestamp < endTimestamp) ||
   (maxTimestamp <= startTimestamp && minTimestamp >= endTimestamp)){
    divStart.style.visibility = 'visible';
    divEnd.style.visibility = 'visible';
    setTime(0);
    setTime(1);
    return [minDate, dateToday];
  } else if ((minTimestamp > startTimestamp) ||
   (maxTimestamp <= startTimestamp)) {
    divStart.style.visibility = 'visible';
    setTime(0);
    return [minDate, end];
  } else if ((minTimestamp >= endTimestamp) ||
   (maxTimestamp < endTimestamp)) {
    divEnd.style.visibility = 'visible';
    setTime(1);
    return [start, dateToday];
  } else return [start, end];
}
