let async = require('async');
let Tx = require('ethereumjs-tx');
let web3 = require('../factories/web3.factory');
let tokens = require('../factories/tokens.factory');
let { generatePublicKey,
  generateAddress } = require('../factories/keys.factory');


let getTransactionCount = (address, cb) => {
  web3.eth.getTransactionCount(address, 'pending',
    (error, count) => {
      if (error) cb(error, null);
      else {
        count = web3.toDecimal(count);
        cb(null, count);
      }
    });
};

let transfer = (fromPrivateKey, toAddress, value, coinSymbol, cb) => {
  fromPrivateKey = Buffer.from(fromPrivateKey, 'hex');
  let fromAddress = '0x' + generateAddress(generatePublicKey(fromPrivateKey, false)).toString('hex');
  async.waterfall([
    (next) => {
      getTransactionCount(fromAddress,
        (error, count) => {
          if (error) next(error, null);
          else next(null, count);
        });
    }, (nonce, next) => {
      try {
        let rawTx = {
          nonce,
          gasPrice: web3.toHex(web3.toDecimal(web3.eth.gasPrice)),
          gasLimit: '0xf4240',
          to: coinSymbol === 'ETH' ? toAddress : tokens[coinSymbol].address,
          value: coinSymbol === 'ETH' ? web3.toHex(value) : '0x',
          data: coinSymbol === 'ETH' ? '0x' : tokens[coinSymbol].contract.transfer.getData(toAddress, value)
        };
        let tx = new Tx(rawTx);
        tx.sign(fromPrivateKey);
        let serializedTx = '0x' + tx.serialize().toString('hex');
        next(null, serializedTx);
      } catch (error) {
        next(error, null);
      }
    }, (serializedTx, next) => {
      web3.eth.sendRawTransaction(serializedTx,
        (error, txHash) => {
          if (error) next(error, null);
          else next(null, txHash);
        }); /* cb(null, Math.random().toString(36)); */
    }
  ], (error, txHash) => {
    cb(error, txHash);
  });
};

let getTxReceipt = (txHash, cb) => {
  web3.eth.getTransactionReceipt(txHash,
    (error, receipt) => {
      if (error) cb(error, null);
      else cb(null, receipt);
    });
};

module.exports = {
  transfer,
  getTxReceipt
};
