# Bitcoin Value Visualizer
Now published [here](https://bitcoin-value-vizualizer.herokuapp.com/)!  
(chart may not be working because of the small number of requests available)

## Short Description
Diploma project for visualizing value of bitcoin with charts.

## Concept 
This project gives client an opportunity to see how the bitcoin values were changed with the time.  
User enters two dates:  
* starting point;
* ending point.  

it allows to show which exactly period of time where the bitcoin was changing user wants to see.  

User can also choose:  
* currency.  

in which he wants to see the value of bitcoin.  
With the given data the chart is built, where when hovering certain points values and data is seen.

## Code structure
This project uses api from [here](https://www.coinapi.io/).  
For better and faster working added cache.

## Issues
The api, that is used for this project allows to get not more then 100 items per 1 call.
Ending date is not included in shown period of time.  
Only 100 requests a day available.

## TODO
* improve interface;  
* add more currencies;  
* add often chosen dates.
