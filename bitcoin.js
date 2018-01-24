//const BitStamp = require('bitstamp-ws');
const cryptoSocket = require("crypto-socket");

//const bit = new BitStamp({order_book:false, diff_order_book:true, live_trades:true});
//module.exports =  (io) => {
//   bit.on('trade', (bitcoin) => {
//      //console.log(bitcoin);
//      let data = {
//         id : bitcoin.id,
//         buy_order_id: bitcoin.buy_order_id,
//         sell_order_id: bitcoin.sell_order_id,
//         provider: 'BitStamp',
//         amount: bitcoin.amount,
//         price: bitcoin.price,
//         close: bitcoin.close,
//         currency: 'USD',
//         timestamp : bitcoin.timestamp
//      };
//      //console.log(data);
//      io.emit('bitcoin', data);
//   })
//};

cryptoSocket.start();

module.exports = (io) =>{
   setTimeout(() => {
      let data = {};
      const exc = cryptoSocket.Exchanges;

      console.log(exc);
      setInterval(function(){
         data = {
            bitstamp: exc.bitstamp.BTCUSD || '',
            gdax: exc.gdax.BTCUSD || '',
            bitMex:  exc.bitmex.BTCUSD || '',
            bittrex: exc.bittrex.BTCUSD || '',
            bitfinex: exc.bitfinex.BTCUSD || '',
            cex : exc.cex.BTCUSD || '',
            okcoin : exc.okcoin.BTCUSD || '',
            poloniex : exc.poloniex.BTCUSD || '',
            gemini : exc.gemini.BTCUSD || ''
         };
         io.emit('bitcoin', data)
      }, 1000)

   }, 3000)
};
/*
*
'bittrex',
    'bitfinex',
    'bitmex',
    'bitstamp',
    'cex',
    'gdax',
    'gemini',
    'okcoin',
    'poloniex'
*/