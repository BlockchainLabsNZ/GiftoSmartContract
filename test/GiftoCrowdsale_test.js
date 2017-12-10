let Gifto = artifacts.require("Gifto");
const assertFail = require("./helpers/assertFail");
const BigNumber = require("bignumber.js");

let giftoDeployed;

contract("Gifto Crowdsale Tests", async function([deployer, investor, vandal, wallet]) {
  beforeEach(async () => {
      giftoDeployed = await Gifto.new();
    });

  it("Can't call deliveryToken for more buyers than there actually are", async () => {
    await giftoDeployed.turnOnSale({ from: deployer });

    await assertFail(async () => {
      await giftoDeployed.buyGifto({ from: vandal, value: web3.toWei(1, 'ether') });
    });

    await assertFail(async () => {
      await giftoDeployed.deliveryToken(0, 1, { from: deployer });
    });
  });

  it("Can't call deliveryToken if there are 0 buyers", async () => {
    await giftoDeployed.turnOnSale({ from: deployer });

    await assertFail(async () => {
      await giftoDeployed.deliveryToken(0, 0, { from: deployer });
    });
  });

  it("Users can be whitelisted", async () => {

    await giftoDeployed.addInvestorList([investor], { from: deployer });

    assert.equal(await giftoDeployed.isApprovedInvestor(investor), true);
    assert.equal(await giftoDeployed.isApprovedInvestor(vandal), false);
  });

  it("Users can be removed from the whitelist", async () => {

    await giftoDeployed.addInvestorList([investor], { from: deployer });

    assert.equal(await giftoDeployed.isApprovedInvestor(investor), true);

    await giftoDeployed.removeInvestorList([investor], { from: deployer });

    assert.equal(await giftoDeployed.isApprovedInvestor(investor), false);
  });

  it("Users cannot receive tokens without being whitelistsed", async () => {
    await giftoDeployed.turnOnSale({ from: deployer });


    await giftoDeployed.addInvestorList([investor], { from: deployer });
    await giftoDeployed.buyGifto({ from: investor, value: web3.toWei(1, 'ether') });

    await assertFail(async () => {
      await giftoDeployed.buyGifto({ from: vandal, value: web3.toWei(1, 'ether') });
    });

    await giftoDeployed.deliveryToken(0, 0, { from: deployer });

    assert.equal((await giftoDeployed.balanceOf(investor)).toNumber(), 4500000000);
    assert.equal((await giftoDeployed.balanceOf(vandal)).toNumber(), 0);
  });

  it("Owner can get a list of all buyers", async () => {
    await giftoDeployed.turnOnSale({ from: deployer });

    await giftoDeployed.addInvestorList([investor], { from: deployer });
    await giftoDeployed.buyGifto({ from: investor, value: web3.toWei(1, 'ether') });
    await assertFail(async () => {
      await giftoDeployed.buyGifto({ from: vandal, value: web3.toWei(1, 'ether') });
    });

    assert.deepEqual(
      await giftoDeployed.getBuyers(),
      [investor]
    );
  });

  it("Anyone can access a buyers eth deposit", async () => {
    await giftoDeployed.turnOnSale({ from: deployer });

    await giftoDeployed.addInvestorList([investor], { from: deployer });
    await giftoDeployed.buyGifto({ from: investor, value: web3.toWei(1, 'ether') });
    await assertFail(async () => {
      await giftoDeployed.buyGifto({ from: vandal, value: web3.toWei(1, 'ether') });
    });

    assert.equal(
      await giftoDeployed.getDeposit(investor, { from: vandal }),
      web3.toWei(1, 'ether')
    );
    assert.equal(
      await giftoDeployed.getDeposit(investor, { from: investor }),
      web3.toWei(1, 'ether')
    );

    await giftoDeployed.buyGifto({ from: investor, value: web3.toWei(1, 'ether') });
    assert.equal(
      await giftoDeployed.getDeposit(investor, { from: vandal }),
      web3.toWei(2, 'ether')
    );
    assert.equal(
      await giftoDeployed.getDeposit(investor, { from: investor }),
      web3.toWei(2, 'ether')
    );
  });

  describe("Only the owner can call these functions", async function () {

    it("setIcoPercent()", async () => {
      assert.equal((await giftoDeployed._icoSupply()).toNumber(), 10000000000000);
      await assertFail(async () => {
        await giftoDeployed.setIcoPercent(30, { from: vandal })
      });
      assert.equal((await giftoDeployed._icoSupply()).toNumber(), 10000000000000);

      await giftoDeployed.setIcoPercent(30, { from: deployer });
      assert.equal((await giftoDeployed._icoSupply()).toNumber(), 30000000000000);
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
      await giftoDeployed.addInvestorList([investor], { from: deployer });
      await web3.eth.sendTransaction({
        from: investor,
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
