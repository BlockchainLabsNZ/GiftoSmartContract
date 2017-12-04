let Gifto = artifacts.require("Gifto");
const assertFail = require("./helpers/assertFail");

let giftoDeployed;

contract("Gifto Crowdsale Tests", async function([deployer, investor, vandal, wallet]) {


  describe("Only the owner can call these functions", async function () {
beforeEach(async () => {
    giftoDeployed = await Gifto.new();
  });
    it("setIcoPercent()", async () => {
      assert.equal(giftoDeployed._icoPercent(), 30);
      assertFail(async () => {
        giftoDeployed.setIcoPercent(10, { from: vandal })
      });
      assert.equal(giftoDeployed._icoPercent(), 30);
      giftoDeployed.setIcoPercent(10, { from: deployer })
      assert.equal(giftoDeployed._icoPercent(), 10);
    });

    it("setMinimumBuy()", async () => {
      assert.equal(giftoDeployed._icoPercent(), web.toWei(0.3));
      assertFail(async () => {
        giftoDeployed.setMinimumBuy(web.toWei(0.5), { from: vandal })
      });
      assert.equal(giftoDeployed._icoPercent(), web.toWei(0.3));
      giftoDeployed.setMinimumBuy(web.toWei(0.5), { from: deployer })
      assert.equal(giftoDeployed._icoPercent(), web.toWei(0.5));
    });

  });
});
