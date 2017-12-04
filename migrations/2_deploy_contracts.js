
const Gifto = artifacts.require("Gifto");
const abiEncoder = require('ethereumjs-abi');

function latestTime() {
  return web3.eth.getBlock('latest').timestamp;
}
const duration = {
  seconds: function (val) { return val },
  minutes: function (val) { return val * this.seconds(60) },
  hours: function (val) { return val * this.minutes(60) },
  days: function (val) { return val * this.hours(24) },
  weeks: function (val) { return val * this.days(7) },
  years: function (val) { return val * this.days(365) }
};

module.exports = function(deployer, network) {

  if(network !== 'development'){
    deployer.deploy(Gifto).then(async function() {
      let tokenDeployed = await Gifto.deployed();
      const encodedGifto = abiEncoder.rawEncode(['address'], [ wallet]);
      console.log('encodedGifto ENCODED: \n', encodedGifto.toString('hex'));
    });
  }
};
