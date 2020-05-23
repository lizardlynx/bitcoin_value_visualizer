'use strict';

document.addEventListener('DOMContentLoaded', () => {

  if (bitcoinCost.length == 0) {
    ifVariableReady();
  }
  
});

//this function creates a chart 
function whenReadyExecute() {
  const chart = new Chart(bitcoinCost);
  chart.drawXY('#e5e5e5');
  chart.findCoords('rgba(20, 33, 61, 0.7)');
  chart.drawFunc('#fca311');
  chart.update();
};

//this function checks if we got data on bitcoin from server and when we get it executes whenReadyExecute
function ifVariableReady() {
  if (bitcoinCost.length == 0) {
    window.setTimeout('ifVariableReady();', 100);
  } else {
    whenReadyExecute();
  }
}
