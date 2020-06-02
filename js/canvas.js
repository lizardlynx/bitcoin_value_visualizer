'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit');
  submitButton.addEventListener('click', event => {
    event.preventDefault();
    ifVariableReady();
  });
});

//this function creates a chart
function whenReadyExecute() {
  const loadGif = document.getElementsByClassName('load')[0];
  loadGif.style.visibility = 'hidden';
  // eslint-disable-next-line no-undef
  const chart = new Chart(bitcoinCost);
  chart.drawXY('#e5e5e5');
  chart.findCoords('rgba(20, 33, 61, 0.7)');
  chart.drawFunc('#fca311');
  chart.update();
  // eslint-disable-next-line no-undef
  bitcoinCost = [];
}

//this function checks if we got data on bitcoin and executes whenReadyExecute
function ifVariableReady() {
  // eslint-disable-next-line no-undef
  if (bitcoinCost.length === 0) {
    window.setTimeout('ifVariableReady();', 100);
  } else {
    whenReadyExecute();
  }
}
