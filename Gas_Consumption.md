## Gas Usage

```
  Contract: Gifto Token ERC20 Tests
    ✓ creation: deploying the token should have an initial balance of 1 billion
    ✓ transfers: should transfer 1bil to accounts[1] with accounts[0] having bil (37408 gas)
    ✓ approvals: msg.sender should approve 100 to accounts[1] (45214 gas)
start
    ✓ transfers: should fail when trying to transfer (1bil+1) to accounts[1] with accounts[0] having 1bil (24378 gas)
    ✓ approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once. (104191 gas)
    ✓ approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice. (148168 gas)
    ✓ approvals: msg.sender approves accounts[1] of 100 & withdraws 50 & 60 (2nd tx should fail) (104191 gas)
    ✓ approvals: attempt withdrawal from account with no allowance (should fail)
    ✓ approvals: allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer. (119341 gas)

  Contract: Gifto Crowdsale Tests
    Only the owner can call these functions
      ✓ setIcoPercent() (54577 gas)
      ✓ setMinimumBuy() (50116 gas)
      ✓ setMaximumBuy() (49584 gas)
      ✓ turnOnSale() (65023 gas)
      ✓ turnOffSale() (77923 gas)
      ✓ setBuyPrice() (49600 gas)
      ✓ withdraw() (178546 gas)

·-------------------------------------------------------------------|-----------------------------------·
│                                Gas                                ·  Block limit: 17592186044415 gas  │
····································|·······························|····································
│  Methods                          ·          5 gwei/gas           ·          369.82 eur/eth           │
···················|················|·········|·········|···········|··················|·················
│  Contract        ·  Method        ·  Min    ·  Max    ·  Avg      ·  # calls         ·  eur (avg)     │
···················|················|·········|·········|···········|··················|·················
│  ERC20Interface  ·  approve       ·  15150  ·  45214  ·    40203  ·               6  ·          0.07  │
···················|················|·········|·········|···········|··················|·················
│  ERC20Interface  ·  transfer      ·  24378  ·  37408  ·    30893  ·               2  ·          0.06  │
···················|················|·········|·········|···········|··················|·················
│  ERC20Interface  ·  transferFrom  ·  43977  ·  58977  ·    55977  ·               5  ·          0.10  │
···················|················|·········|·········|···········|··················|·················
│  Deployments                      ·                               ·  % of limit      ·                │
····································|·········|·········|···········|··················|·················
│  ERC20Interface                   ·      -  ·      -  ·  2793892  ·             0 %  ·          5.17  │
·-----------------------------------|---------|---------|-----------|------------------|----------------·

  16 passing (2m)

  ```
