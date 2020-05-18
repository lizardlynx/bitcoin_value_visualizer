'use strict';

document.addEventListener('DOMContentLoaded', async() => {

  if (bitcoinCost.length == 0) {
    getData();
    ifVariableReady();
  }

  
});

//this function creates a chart 
function whenReadyExecute() {
  const chart = new Chart(bitcoinCost);
  chart.drawXY('#1B3954');
  chart.drawSect('rgba(158, 134, 106, 0.5)');
  chart.drawFunc();
};

//this function checks if we got data on bitcoin from server and when we get it executes whenReadyExecute
function ifVariableReady() {
  if (bitcoinCost.length == 0) {
    window.setTimeout('ifVariableReady();', 100);

  } else {
    whenReadyExecute();
  }
}

class Chart {

  constructor (bitcoinCost) {
    this.bitcoinCost = bitcoinCost

    this.canvas = document.querySelector('canvas');
    this.c = canvas.getContext('2d');


    this.startX = (window.innerWidth - 100) * 1/10;
    this.startY = (window.innerHeight - 200) * 8/10;

    this.canvas.width = window.innerWidth - 100;
    this.canvas.height = window.innerHeight - 200;

    this.endX = this.canvas.width - this.startX;
    this.endY = this.canvas.height - this.startY;

    this.dots = [];

  };

  drawLine (x1, y1, x2, y2, color) {
    this.c.beginPath();
    this.c.strokeStyle = color;
    this.c.moveTo(x1, y1);
    this.c.lineTo(x2, y2);
    this.c.stroke();
  }

  drawXY (color) {

    this.drawLine(this.startX, this.startY, this.startX, this.endY, color);
    this.c.font = "bold 18px Verdana";
    this.c.fillText('American $', this.startX - 50, this.endY - 50);
    
    this.drawLine(this.startX - 6, this.startY, this.endX, this.startY, color);
  }

  drawSect(color) {
    const bitcoinCost = this.bitcoinCost;
    let bitcoinValues = [];
    const numberOfDays = bitcoinCost.length;
    let maxBTCValue = 0;

    const lengthOX = this.endX - this.startX - 20;
    const dx = lengthOX / numberOfDays;

    for (let i = 1; i <= numberOfDays; i++) {

      const dailyPrice = bitcoinCost[i - 1].price;
      bitcoinValues.push(dailyPrice);
      if (dailyPrice > maxBTCValue) {
        maxBTCValue = dailyPrice;
      }

      const x = this.startX + dx*i;
      this.drawLine(x, this.startY + 5, x, this.startY, '#1B3954');
    }
    bitcoinValues.sort();

    const lengthOY = this.startY - this.endY - 20;
    const dy = lengthOY / numberOfDays;
    
    let yByValue = [];

    for (let i = 1; i <= numberOfDays; i++) {
      const y = this.startY - dy*i;
      const value = bitcoinValues[i - 1];
      this.drawLine(this.startX - 10, y, this.endX, y, color);
      yByValue.push([y, value]);
    }
    
    for (let i = 0; i < numberOfDays; i++) {
      const x = this.startX + dx*(i + 1);
      const valueX = bitcoinCost[i].price;
      for (let j = 0; j < numberOfDays; j++) {
        const y = yByValue[j][0];
        const valueY = yByValue[j][1];
        if (valueX == valueY) {
          this.dots.push([x, y]);
        }
      }
    }
    console.log(this.dots);

  }

  drawFunc() {
    const bitcoinCost = this.bitcoinCost;
    const numberOfDays = bitcoinCost.length;

    this.c.beginPath();
    this.c.strokeStyle = '#1B3954';
    this.c.moveTo(this.dots[0][0], this.dots[0][1]);
    for (let i = 1; i < numberOfDays; i++) {
      const nextX = this.dots[i][0];
      const nextY = this.dots[i][1];
      console.log(nextX, nextY);
      this.c.lineTo(nextX, nextY);
      this.c.stroke();
    }
  }

}



