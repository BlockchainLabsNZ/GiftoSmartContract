let Gifto = artifacts.require("Gifto");
const assertFail = require("./helpers/assertFail");
const BigNumber = require("bignumber.js");

let giftoDeployed;

contract("Gifto Crowdsale Tests", async function([deployer, investor, vandal, wallet]) {


  describe("Only the owner can call these functions", async function () {
beforeEach(async () => {
    giftoDeployed = await Gifto.new();
  });
    it("setIcoPercent()", async () => {
      assert.equal((await giftoDeployed._icoSupply()).toNumber(), 30000000000000);
      await assertFail(async () => {
        await giftoDeployed.setIcoPercent(10, { from: vandal })
      });
      assert.equal((await giftoDeployed._icoSupply()).toNumber(), 30000000000000);

      await giftoDeployed.setIcoPercent(10, { from: deployer });
      assert.equal((await giftoDeployed._icoSupply()).toNumber(), 10000000000000);
    });

    it("setMinimumBuy()", async () => {
      assert.equal((await giftoDeployed._minimumBuy()).toNumber(), web3.toWei(0.3, 'ether'));
      await assertFail(async () => {
        await giftoDeployed.setMinimumBuy(web3.toWei(0.5, 'ether'), { from: vandal })
      });
      assert.equal((await giftoDeployed._minimumBuy()).toNumber(), web3.toWei(0.3, 'ether'));

      await giftoDeployed.setMinimumBuy(web3.toWei(0.5, 'ether'), { from: deployer })
      assert.equal((await giftoDeployed._minimumBuy()).toNumber(), web3.toWei(0.5, 'ether'));
    });

    it("setMaximumBuy()", async () => {
      assert.equal((await giftoDeployed._maximumBuy()).toNumber(), web3.toWei(30, 'ether'));
      await assertFail(async () => {
        await giftoDeployed.setMaximumBuy(web3.toWei(50, 'ether'), { from: vandal })
      });
      assert.equal((await giftoDeployed._maximumBuy()).toNumber(), web3.toWei(30, 'ether'));

      await giftoDeployed.setMaximumBuy(web3.toWei(50, 'ether'), { from: deployer })
      assert.equal((await giftoDeployed._maximumBuy()).toNumber(), web3.toWei(50, 'ether'));
    });


    it("turnOnSale()", async () => {
      assert.equal(await giftoDeployed._selling(), false);
      await assertFail(async () => {
        await giftoDeployed.turnOnSale({ from: vandal })
      });
      assert.equal(await giftoDeployed._selling(), false);

      await giftoDeployed.turnOnSale({ from: deployer })
      assert.equal(await giftoDeployed._selling(), true);
    });

    it("turnOffSale()", async () => {
      await giftoDeployed.turnOnSale({ from: deployer });
      assert.equal(await giftoDeployed._selling(), true);
      await assertFail(async () => {
        await giftoDeployed.turnOffSale({ from: vandal })
      });
      assert.equal(await giftoDeployed._selling(), true);

      await giftoDeployed.turnOffSale({ from: deployer })
      assert.equal(await giftoDeployed._selling(), false);
    });

    it("setBuyPrice()", async () => {
      assert.equal((await giftoDeployed._originalBuyPrice()).toNumber(), 300000000);
      await assertFail(async () => {
        await giftoDeployed.setBuyPrice(500000000, { from: vandal })
      });
      assert.equal((await giftoDeployed._originalBuyPrice()).toNumber(), 300000000);

      await giftoDeployed.setBuyPrice(500000000, { from: deployer })
      assert.equal((await giftoDeployed._originalBuyPrice()).toNumber(), 500000000);
    });

    it("withdraw()", async () => {
      await giftoDeployed.turnOnSale();

      assert.equal(web3.eth.getBalance(giftoDeployed.address), 0);
      await web3.eth.sendTransaction({
        from: deployer,
        to: giftoDeployed.address,
        value: web3.toWei(1, 'ether')
      });
      assert.equal((web3.eth.getBalance(giftoDeployed.address)).toNumber(), web3.toWei(1, 'ether'));

      await assertFail(async () => {
        await giftoDeployed.withdraw({ from: vandal });
      });
      await giftoDeployed.withdraw({ from: deployer });
      assert.equal((web3.eth.getBalance(giftoDeployed.address)).toNumber(), 0);
    });
  });
});
