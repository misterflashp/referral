let Web3 = require('web3');
let chainConfigs = require('../../config/ethereum/chains');


let chainConfig = chainConfigs.rinkeby;
let web3 = new Web3(new Web3.providers.HttpProvider(chainConfig.rpcServerAddress));

module.exports = web3;