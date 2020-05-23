'use strict';

//monthes in parse time
const monthes = ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

//function for parsing time for better visuals
function parseTime(time) {
  const date = time.split('T')[0];
  const ymd = date.split('-');
  const month = monthes[ymd[1] - 1];
  return ymd[2] + ' ' + month + ' ' + ymd[0];
}

//class chart creates a chart
class Chart {

    constructor (bitcoinCost) {
      this.bitcoinCost = bitcoinCost
  
      this.canvas = document.querySelector('canvas');
      this.c = canvas.getContext('2d');
  
      this.canvas.width = document.getElementById('wrap-up').clientWidth;
      this.canvas.height = document.getElementById('wrap-up').clientHeight;
  
      this.startX = this.canvas.width * 1/10;
      this.startY = this.canvas.height * 8/10;
  
      this.endX = this.canvas.width - this.startX;
      this.endY = this.canvas.height - this.startY;
  
      this.dots = [];
  
    };
  
    //draws line of a specific color with specific x and y
    drawLine (x1, y1, x2, y2, color) {
      this.c.beginPath();
      this.c.lineWidth = 1;
      this.c.strokeStyle = color;
      this.c.moveTo(x1, y1);
      this.c.lineTo(x2, y2);
      this.c.stroke();
    }
  
    //draws ox and oy
    drawXY (color) {
  
      this.drawLine(this.startX, this.startY, this.startX, this.endY, color);
      this.c.font = "18px Verdana";
      this.c.fillStyle = color;
      this.color = color;
      this.c.fillText('American $', this.startX - 50, this.endY - 50);
      
      this.drawLine(this.startX - 40, this.startY, this.endX, this.startY, color);
    }
  
  
    //finds coordinats dependant on values
    findCoords(color) {
  
      //finding maximum value of bitcoin for drawing y and x lines 
      const bitcoinCost = this.bitcoinCost;
      let bitcoinValues = [];
      const numberOfDays = bitcoinCost.length;
      let maxBTCValue = 0;
  
      const lengthOX = this.endX - this.startX - 20;
      const dx = lengthOX / numberOfDays;
  
      for (let i = 1; i <= numberOfDays; i++) {
  
        const dailyPrice = bitcoinCost[i - 1].price;
        bitcoinValues.push([dailyPrice, bitcoinCost[i - 1].day]);
  
        if (dailyPrice > maxBTCValue) {
          maxBTCValue = dailyPrice;
        }
  
        const x = this.startX + dx*i;
        this.drawLine(x, this.startY + 5, x, this.startY, this.color);
      }
  
      //drawing y lines
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
          if (i !== 0) {
            const y = this.startY - (value * lengthOY / maxBTCValue);
            this.drawLine(this.startX - 40, y, this.endX, y, color);
            this.c.fillText(+(value), this.startX - 60, y - 2);
          }
          if (cost.length > 0) {
            i = Number('0.' + cost + '1');
          } else {
            i = 0.1;
          }
          value = +(i + +(value)).toFixed(numOfDigitsAC + 1);
        } else {
          value = cost;
          value = i + value;
          if (i !== 0) {
            const y = this.startY - (value * lengthOY / maxBTCValue);
            this.drawLine(this.startX - 40, y, this.endX, y, color);
            this.c.fillText(+(value), this.startX - 60, y - 2);
          }
          i++;
        }
      }
    
      //finding y by value
      let yByValue = [];
  
      for (let i = 1; i <= numberOfDays; i++) {
        const value = bitcoinValues[i - 1][0];
        const y = this.startY - (value * lengthOY / maxBTCValue);
        yByValue.push([y, value, false]);
      }
      
      //finding x by value
      for (let i = 0; i < numberOfDays; i++) {
        const x = this.startX + dx*(i + 1);
        const valueX = bitcoinValues[i][0];
        const date = bitcoinValues[i][1];
        for (let j = 0; j < numberOfDays; j++) {
          const y = yByValue[j][0];
          const valueY = yByValue[j][1];
          if (valueX == valueY && yByValue[j][2] !== true) {
            this.dots.push([x, y, valueX, date]);
            yByValue[j][2] = true;
            break;
          }
        }
      };
    };
  
    //this function draws a function
    drawFunc(color) {
      const bitcoinCost = this.bitcoinCost;
      const numberOfDays = bitcoinCost.length;
  
      this.c.beginPath();
      this.c.strokeStyle = color;
      this.c.lineWidth = 2;
      this.c.moveTo(this.dots[0][0], this.dots[0][1]);
  
      for (let i = 1; i < numberOfDays; i++) {
        const nextX = this.dots[i][0];
        const nextY = this.dots[i][1];
  
        this.c.strokeStyle = color;
        this.c.lineTo(nextX, nextY);
        this.c.stroke();
      };
    };
  
    //this function allows to see at which part of function the mouse points
    update() {
  
      const gap = (this.endX - this.startX - 20)/this.bitcoinCost.length;
      //adds a yellow circle and info on this point
      document.querySelector('canvas').addEventListener('mousemove', mouse => {
        for (let i = 0; i < this.dots.length; i++) {
          const x = this.dots[i][0];
          const y = this.dots[i][1];
          if (x - mouse.x <= gap/2 && x - mouse.x >= -gap/2) {
  
            //info class
            const info = document.getElementsByClassName('info')
            for (let div of info) {
              div.style.visibility = 'visible';
            };
            const circle = info[0];
            const date = info[1];
  
            const dif = circle.clientHeight/2;
            circle.style.left = x - dif;
            circle.style.top = y - dif;
  
            //pop-up
            circle.setAttribute('price', this.dots[i][2] + ` $`);
  
            //dates
            date.style.left = x - dif;
            date.style.top = this.startY;
            date.innerText = parseTime(this.dots[i][3]);
          }
        };
      });
      
      //removes the yellow circle and date when cursor is not on canvas
      document.getElementById('wrap-up').addEventListener('mouseleave', () => {
        const info = document.getElementsByClassName('info')
          for (let div of info) {
            div.style.visibility = 'hidden';
          };
      });
    };
  
  };