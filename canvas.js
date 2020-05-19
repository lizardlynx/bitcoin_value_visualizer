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
  chart.drawXY('#071330');
  chart.findCoords('rgba(158, 134, 106, 0.3)');
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


//class chart creates a chart
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

  //draws line of a specific color with specific x and y
  drawLine (x1, y1, x2, y2, color) {
    this.c.beginPath();
    this.c.strokeStyle = color;
    this.c.moveTo(x1, y1);
    this.c.lineTo(x2, y2);
    this.c.stroke();
  }

  //draws ox and oy
  drawXY (color) {

    this.drawLine(this.startX, this.startY, this.startX, this.endY, color);
    this.c.font = "bold 18px Verdana";
    this.c.fillText('American $', this.startX - 50, this.endY - 50);
    
    this.drawLine(this.startX - 6, this.startY, this.endX, this.startY, color);
  }


  //finds coordsinats dependant on values
  findCoords(color) {
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

    const lengthOY = this.startY - this.endY - 20;
    const beforeComma = maxBTCValue.toString().split('.')[0];
    const numOfDigitsBC = beforeComma.length;
    let numOfDigitsAC = 0;
    if (maxBTCValue < 1) {
      const afterComma = maxBTCValue.toString().split('.')[1];
      numOfDigitsAC = afterComma.length;
    } else if (maxBTCValue == 1) {
      numOfDigitsAC = 1;
    }

    let cost = '';
    if (beforeComma != 0) {
      while (cost.length < numOfDigitsBC - 1) {
        cost += '0';
      }
    } else {
      while (cost.length < numOfDigitsAC - 1) {
        cost += '0';
      }
    }    

    let value = cost;

    this.c.font = "16px Arial";

    let i = 0;

    while (value <= maxBTCValue) {
      
      if (maxBTCValue <= 1) {
        const y = this.startY - (value * lengthOY / maxBTCValue);
        this.drawLine(this.startX - 30, y, this.endX, y, color);
        this.c.fillText(+(value), this.startX - 60, y - 2);
        if (cost.length > 0) {
          i = Number('0.' + cost + '1');
        } else {
          i = 0.1;
        }
        value = +(i + +(value)).toFixed(numOfDigitsAC + 1);
      } else {
        value = cost;
        value = i + value;
        const y = this.startY - (value * lengthOY / maxBTCValue);
        this.drawLine(this.startX - 30, y, this.endX, y, color);
        this.c.fillText(+(value), this.startX - 60, y - 2);
        i++;
      }
    }
  
    let yByValue = [];

    for (let i = 1; i <= numberOfDays; i++) {
      const value = bitcoinValues[i - 1];
      const y = this.startY - (value * lengthOY / maxBTCValue);
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

  }

  //this function draws a function
  drawFunc() {
    const bitcoinCost = this.bitcoinCost;
    const numberOfDays = bitcoinCost.length;

    this.c.beginPath();
    this.c.strokeStyle = '#F7CB2D';
    this.c.lineWidth = 2;
    this.c.moveTo(this.dots[0][0], this.dots[0][1]);

    for (let i = 1; i < numberOfDays; i++) {
      const nextX = this.dots[i][0];
      const nextY = this.dots[i][1];

      this.c.lineTo(nextX, nextY);
      this.c.stroke();
    }
  }

}



