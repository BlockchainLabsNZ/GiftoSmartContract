# Gifto Audit Report

## Preamble
This audit report was undertaken by BlockchainLabs.nz for the purpose of providing feedback to Gifto. It has subsequently been shared publicly without any express or implied warranty.

Solidity contracts were sourced from the public Github repo [gifto-io/GiftoSmartContract](https://github.com/BlockchainLabsNZ/gifto-contracts/tree/master/contracts) prior to commit [50e1f1895dd91a0dad0d4f0b2ea620e5827ed1fa](https://github.com/gifto-io/GiftoSmartContract/tree/50e1f1895dd91a0dad0d4f0b2ea620e5827ed1fa) - we would encourage all community members and token holders to make their own assessment of the contracts.

## Scope
All Solidity code contained in [/contracts](https://github.com/BlockchainLabsNZ/gifto-contracts) was considered in scope along with the tests contained in [/test](https://github.com/BlockchainLabsNZ/gifto-contracts/tree/master/test) as a basis for static and dynamic analysis.

## Focus Areas
The audit report is focused on the following key areas - though this is not an exhaustive list.
### Correctness
- No correctness defects uncovered during static analysis?
- No implemented contract violations uncovered during execution?
- No other generic incorrect behaviour detected during execution?
- Adherence to adopted standards such as ERC20?
### Testability
- Test coverage across all functions and events?
- Test cases for both expected behaviour and failure modes?
- Settings for easy testing of a range of parameters?
- No reliance on nested callback functions or console logs?
- Avoidance of test scenarios calling other test scenarios?
### Security
- No presence of known security weaknesses?
- No funds at risk of malicious attempts to withdraw/transfer?
- No funds at risk of control fraud?
- Prevention of Integer Overflow or Underflow?
### Best Practice
- Explicit labeling for the visibility of functions and state variables?
- Proper management of gas limits and nested execution?
- Latest version of the Solidity compiler?

## Classification
### Defect Severity
- Minor - A defect that does not have a material impact on the contract execution and is likely to be subjective.
- Moderate - A defect that could impact the desired outcome of the contract execution in a specific scenario.
- Major - A defect that impacts the desired outcome of the contract execution or introduces a weakness that may be exploited.
- Critical - A defect that presents a significant security vulnerability or failure of the contract across a range of scenarios.

## Findings
### Minor
- **Use .transfer instead of .send** - `Best practice` This is a very minor issue because `.send` is still value, but `.transfer` has a richer interface and allows you to override the gas limit, which `.send` does not. There is some discussion on `.send` vs `.transfer` here:   [View on GitHub](https://github.com/BlockchainLabsNZ/gifto-contracts/issues/10)
  - [ ] Not Fixed
- **Explicitly declare your variable types** - `Best practice` `uint` will default to `uint256` but it is recommended to explicitly declare it as `uint256`  [View on GitHub](https://github.com/BlockchainLabsNZ/gifto-contracts/issues/9)
  - [ ] Not Fixed
- **Explicitly declare your variables access modifiers** - `Best practice` You should explicitly declare `public` on the variables that are meant to be `public`. This can help to avoid errors, but it can also cause unexpected behaviour.  [View on GitHub](https://github.com/BlockchainLabsNZ/gifto-contracts/issues/8)
  - [ ] Not Fixed
- **Convention is to use capital letters for the token "symbol"** -    [View on GitHub](https://github.com/BlockchainLabsNZ/gifto-contracts/issues/6)
  - [ ] Not Fixed
- **Format repository to follow standard convention (add folders, separate files)** - `Best practice` We strongly recommend restructuring the files in your repo to follow conventional approach of other token launches. This is so that relevant files can be more easily found and increases trransparency See here for examples:    [View on GitHub](https://github.com/BlockchainLabsNZ/gifto-contracts/issues/1)
  - [ ] Not Fixed

### Moderate
- **Missing SafeMath Library** - `Best practice`, Correctness` For calculations we recommend using [SafeMath.sol](https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/math/SafeMath.sol) http://zeppelin-solidity.readthedocs.io/en/latest/safemath.html This ensures against and prevents the unsigned integer overflow issue.  [View on GitHub](https://github.com/BlockchainLabsNZ/gifto-contracts/issues/3)
  - [ ] Not Fixed
- **Missing tests** - `Best practice` We recommend a separate folder is created containing written tests using a development framework such as Truffle and Testrpc. This will greatly help to ensure that contract behavior works as expected.  [View on GitHub](https://github.com/BlockchainLabsNZ/gifto-contracts/issues/2)
  - [ ] Not Fixed
  
### Major
- **Token does not follow ERC20 Token Standard - Missing `approve` function** - `Correctness` The token standard can be seen here: https://theethereum.wiki/w/index.php/ERC20_Token_Standard Tests created for ERC20 Standard:  The `approve` function must be implemented for the Gifto token to be compatible with ERC20. Failing to meet the ERC20 Token Standard can mean you won't get accepted on exchanges and may be incompatible with some Ethereum wallets.  [View on GitHub](https://github.com/BlockchainLabsNZ/gifto-contracts/issues/5)
  - [x] Fixed [84602fbe](https://github.com/BlockchainLabsNZ/gifto-contracts/commit/de37a1860bb788b4447b0f2d9025150594ddfbfc)
- **function createCoin() should not be allowed to be called more than once** - `Correctness` We recommend adding a modifier so that createCoin() cannot be called by anybody more than once. This ensures that the total supply cannot be increased anymore than what is originally minted.   [View on GitHub](https://github.com/BlockchainLabsNZ/gifto-contracts/issues/4)
  - [x] Fixed [63108870](https://github.com/BlockchainLabsNZ/gifto-contracts/commit/87701be0f15b5610ffdbc1a32514c974a0fd5239)

### Critical
- None found

## Addendum
Upon finalization of the contracts to be used by Gifto, we have diligently enumerated each function within the contracts including deployment which can be viewed at [Kovan_Tests.md](https://github.com/BlockchainLabsNZ/gifto-contracts/blob/master/Kovan_Tests.md)

We have reviewed this document to ensure that there are no ommisions and that the developers' comments are a fair summary of each function.

## Conclusion
Overall we have been satisfied with the resulting contracts following the audit feedback period. We took part in creating a test suite using the Truffle Framework to fully satisfy coverage in all areas.

The developers have followed common best practices and demonstrated an awareness for the need of adding clarity to certain aspects in their contracts to avoid confusion and improve transparency.
