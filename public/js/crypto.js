(function (w, io)
{
   'use strict';
  
   let socket = io.connect('http://localhost:3000');

   socket.on('connect', function ()
   {
      console.log('Connected from Client')
   });

   let gebi = document.getElementByID;
   coins = [gebi("one"), gebi("two"), gebi("three")];

   socket.on('bitcoin', function (data)
   {
      console.log(data);
      coins[0].textContent = data.bitstamp;
      coins[1].textContent = data.bitMex;
      coins[2].textContent = data.bitfinex;
   });


}(window, io));
