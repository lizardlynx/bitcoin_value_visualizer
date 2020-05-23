'use strict';

document.addEventListener('DOMContentLoaded', () => {

  if (bitcoinCost.length == 0) {
    getData();
    ifVariableReady();
  }
  
});

//this function creates a chart 
function whenReadyExecute() {
  const chart = new Chart(bitcoinCost);
  chart.drawXY('#071330');
  chart.findCoords('rgba(158, 134, 106, 0.3)');
  chart.drawFunc('#F7CB2D');
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
