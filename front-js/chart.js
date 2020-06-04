/* eslint-disable no-unused-vars */
'use strict';

//monthes in parse time
const monthes = ['Jan', 'Feb', 'March',
  'Apr', 'May', 'June',
  'July', 'Aug', 'Sept',
  'Oct', 'Nov', 'Dec'];

//function for parsing time for better visuals
function parseTime(time) {
  const date = time.split('T')[0];
  const ymd = date.split('-');
  const month = monthes[ymd[1] - 1];
  return ymd[2] + ' ' + month + ' ' + ymd[0];
}

//class chart creates a chart
class Chart {

  constructor(bitcoinCost) {
    this.bitcoinCost = bitcoinCost;
    this.canvas = document.querySelector('canvas');
    this.c = this.canvas.getContext('2d');
  }

  //updates width and height
  chartHeightAndWidth() {
    this.canvas.width = document.getElementById('wrap-up').clientWidth;
    this.canvas.height = document.getElementById('wrap-up').clientHeight;

    let k = 1;
    if (this.canvas.width < 652 && this.canvas.width >= 314) {
      k = 2;
    } else if (this.canvas.width < 314) {
      k = 2.5;
    }

    this.startX = this.canvas.width * k / 10;
    this.startY = this.canvas.height * 8 / 10;
    this.endX = this.canvas.width - this.startX;
    this.endY = this.canvas.height - this.startY;
  }

  //draws line of a specific color with specific x and y
  drawLine(x1, y1, x2, y2, color) {
    this.c.beginPath();
    this.c.lineWidth = 1;
    this.c.strokeStyle = color;
    this.c.moveTo(x1, y1);
    this.c.lineTo(x2, y2);
    this.c.stroke();
  }

  //draws ox and oy
  drawXY(color) {
    this.dots = [];
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.chartHeightAndWidth();

    this.drawLine(this.startX, this.startY, this.startX, this.endY, color);
    this.c.font = 'bold 18px bitcoinFontBold';
    this.c.fillStyle = color;
    this.color = color;

    // eslint-disable-next-line no-undef
    this.c.fillText(currency, this.startX - 10, this.endY - 30);
    this.drawLine(this.startX - 40, this.startY, this.endX, this.startY, color);
  }


  //finds coordinats dependant on values
  findCoords(color) {
    this.color2 = color;

    //finding maximum value of bitcoin for drawing y and x lines
    this.dots = [];
    const bitcoinCost = this.bitcoinCost;
    const bitcoinValues = [];
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
    }

    //drawing y lines
    const lengthOY = this.startY - this.endY - 20;
    const beforeComma = maxBTCValue.toString().split('.')[0];
    const numOfDigitsBC = beforeComma.length;
    let numOfDigitsAC = 0;
    if (maxBTCValue < 1) {
      const afterComma = maxBTCValue.toString().split('.')[1];
      numOfDigitsAC = afterComma.length;
    } else if (maxBTCValue === 1) {
      numOfDigitsAC = 1;
    }

    let cost = '';
    if (beforeComma !== 0) {
      while (cost.length < numOfDigitsBC - 1) {
        cost += '0';
      }
    } else {
      while (cost.length < numOfDigitsAC - 1) {
        cost += '0';
      }
    }

    let value = cost;
    this.c.font = 'bold 16px bitcoinFontBold';
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
    const yByValue = [];

    for (let i = 1; i <= numberOfDays; i++) {
      const value = bitcoinValues[i - 1][0];
      const y = this.startY - (value * lengthOY / maxBTCValue);
      yByValue.push([y, value, false]);
    }

    //finding x by value
    for (let i = 0; i < numberOfDays; i++) {
      const x = this.startX + dx * (i + 1);
      const valueX = bitcoinValues[i][0];
      const date = bitcoinValues[i][1];
      for (let j = 0; j < numberOfDays; j++) {
        const y = yByValue[j][0];
        const valueY = yByValue[j][1];
        if (valueX === valueY && yByValue[j][2] !== true) {
          this.dots.push([x, y, valueX, date]);
          yByValue[j][2] = true;
          break;
        }
      }
    }
  }

  //this function draws a function
  drawFunc(color) {
    this.color3 = color;
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
    }
  }

  //this function allows to see at which part of function the mouse points
  update() {
    const gap = (this.endX - this.startX - 20) / this.bitcoinCost.length;
    const dots = this.dots;
    const startY = this.startY;

    //adds a yellow circle and info on this point
    function moveCircle(mouse) {
      for (let i = 0; i < dots.length; i++) {
        const x = dots[i][0];
        const y = dots[i][1];
        if (x - mouse.x <= gap / 2 && x - mouse.x >= -gap / 2) {

          //info class
          const info = document.getElementsByClassName('info');
          for (const div of info) {
            div.style.visibility = 'visible';
          }
          const circle = info[0];
          const date = info[1];
          const dif = circle.clientHeight / 2;
          circle.style.left = x - dif;
          circle.style.top = y - dif;

          //pop-up
          // eslint-disable-next-line no-undef
          const price = ` ${document.getElementById(currency).value}`;
          circle.setAttribute('price', dots[i][2] + price);

          //dates
          date.style.left = x - dif;
          date.style.top = startY;
          date.innerText = parseTime(dots[i][3]);
        }
      }
    }

    document.querySelector('canvas').addEventListener('mousemove', moveCircle);
    document.getElementById('wrap-up').addEventListener('mouseleave', () => {

      //removes the yellow circle and date when cursor is not on canvas
      const info = document.getElementsByClassName('info');
      for (const div of info) {
        div.style.visibility = 'hidden';
      }

      //removes eventlistener for calling a yellow circle when clicked "submit"
      const submitButton = document.getElementById('submit');
      submitButton.addEventListener('click', () => {
        // eslint-disable-next-line max-len
        document.querySelector('canvas').removeEventListener('mousemove', moveCircle);
      });
    });
  }

}
