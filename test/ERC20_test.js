let Gifto = artifacts.require("Gifto");
const assertFail = require("./helpers/assertFail");

let giftoDeployed;

contract("Gitfo Token ERC20 Tests", function(accounts) {
  beforeEach(async () => {
    giftoDeployed = await Gifto.new();
  });
  // CREATION
  it("creation: deploying the token should have an initial balance of 1 billion", async () => {
    assert.equal(
      (await giftoDeployed.balanceOf.call(accounts[0])).toNumber(),
      100000000000000
    );
  });

  // TRANSERS
  it("transfers: should transfer 1bil to accounts[1] with accounts[0] having bil", async () => {
    watcher = giftoDeployed.Transfer();
    await giftoDeployed.transfer(accounts[1], 100000000000000, {
      from: accounts[0]
    });
    let logs = watcher.get();
    assert.equal(logs[0].event, "Transfer");
    assert.equal(logs[0].args._from, accounts[0]);
    assert.equal(logs[0].args._to, accounts[1]);
    assert.equal(logs[0].args._value.toNumber(), 100000000000000);
    assert.equal(await giftoDeployed.balanceOf.call(accounts[0]), 0);
    assert.equal(
      (await giftoDeployed.balanceOf.call(accounts[1])).toNumber(),
      100000000000000
    );
  });

  it("transfers: should fail when trying to transfer (1bil+1) to accounts[1] with accounts[0] having 1bil", async () => {
    assertFail(async () => {
      await giftoDeployed.transfer(accounts[1], 100000000000001, {
        from: accounts[0]
      });
    });
    assert.equal(
      (await giftoDeployed.balanceOf.call(accounts[0])).toNumber(),
      100000000000000
    );
  });

  // APPROVALS
  it("approvals: msg.sender should approve 100 to accounts[1]", async () => {
    watcher = giftoDeployed.Approval();
    await giftoDeployed.approve(accounts[1], 100, { from: accounts[0] });
    let logs = watcher.get();
    assert.equal(logs[0].event, "Approval");
    assert.equal(logs[0].args._owner, accounts[0]);
    assert.equal(logs[0].args._spender, accounts[1]);
    assert.strictEqual(logs[0].args._value.toNumber(), 100);

    assert.strictEqual(
      (await giftoDeployed.allowance.call(accounts[0], accounts[1])).toNumber(),
      100
    );
  });

  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once.", async () => {
    watcher = giftoDeployed.Transfer();
    await giftoDeployed.approve(accounts[1], 100, { from: accounts[0] });

    assert.strictEqual(
      (await giftoDeployed.balanceOf.call(accounts[2])).toNumber(),
      0
    );
    await giftoDeployed.transferFrom(accounts[0], accounts[2], 20, {
      from: accounts[1]
    });

    var logs = watcher.get();
    assert.equal(logs[0].event, "Transfer");
    assert.equal(logs[0].args._from, accounts[0]);
    assert.equal(logs[0].args._to, accounts[2]);
    assert.strictEqual(logs[0].args._value.toNumber(), 20);

    assert.strictEqual(
      (await giftoDeployed.allowance.call(accounts[0], accounts[1])).toNumber(),
      80
    );

    assert.strictEqual(
      (await giftoDeployed.balanceOf.call(accounts[2])).toNumber(),
      20
    );
    await giftoDeployed.balanceOf.call(accounts[0]);
    assert.equal(
      (await giftoDeployed.balanceOf.call(accounts[0])).toNumber(),
      99999999999980
    );
  });

  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice.", async () => {
    await giftoDeployed.approve(accounts[1], 100, { from: accounts[0] });
    await giftoDeployed.transferFrom(accounts[0], accounts[2], 20, {
      from: accounts[1]
    });
    await giftoDeployed.transferFrom(accounts[0], accounts[2], 20, {
      from: accounts[1]
    });
    await giftoDeployed.allowance.call(accounts[0], accounts[1]);

    assert.strictEqual(
      (await giftoDeployed.allowance.call(accounts[0], accounts[1])).toNumber(),
      60
    );

    assert.strictEqual(
      (await giftoDeployed.balanceOf.call(accounts[2])).toNumber(),
      40
    );

    assert.equal(
      (await giftoDeployed.balanceOf.call(accounts[0])).toNumber(),
      99999999999960
    );
  });

  //should approve 100 of msg.sender & withdraw 50 & 60 (should fail).
  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 50 & 60 (2nd tx should fail)", async () => {
    await giftoDeployed.approve(accounts[1], 100, { from: accounts[0] });
    await giftoDeployed.transferFrom(accounts[0], accounts[2], 50, {
      from: accounts[1]
    });
    assert.strictEqual(
      (await giftoDeployed.allowance.call(accounts[0], accounts[1])).toNumber(),
      50
    );

    assert.strictEqual(
      (await giftoDeployed.balanceOf.call(accounts[2])).toNumber(),
      50
    );

    assert.equal(
      (await giftoDeployed.balanceOf.call(accounts[0])).toNumber(),
      99999999999950
    );
    assertFail(async () => {
      await giftoDeployed.transferFrom.call(accounts[0], accounts[2], 60, {
        from: accounts[1]
      });
    });

    assert.strictEqual(
      (await giftoDeployed.balanceOf.call(accounts[2])).toNumber(),
      50
    );
    assert.equal(
      (await giftoDeployed.balanceOf.call(accounts[0])).toNumber(),
      99999999999950
    );
  });

  it("approvals: attempt withdrawal from account with no allowance (should fail)", async () => {
    assertFail(async () => {
      await giftoDeployed.transferFrom.call(accounts[0], accounts[2], 60, {
        from: accounts[1]
      });
    });
    assert.equal(
      (await giftoDeployed.balanceOf.call(accounts[0])).toNumber(),
      100000000000000
    );
  });

  it("approvals: allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer.", async () => {
    await giftoDeployed.approve(accounts[1], 100, { from: accounts[0] });
    await giftoDeployed.transferFrom(accounts[0], accounts[2], 60, {
      from: accounts[1]
    });
    await giftoDeployed.approve(accounts[1], 0, { from: accounts[0] });
    assertFail(async () => {
      await giftoDeployed.transferFrom.call(accounts[0], accounts[2], 10, {
        from: accounts[1]
      });
    });
    assert.equal(
      (await giftoDeployed.balanceOf.call(accounts[0])).toNumber(),
      99999999999940
    );
  });
});
