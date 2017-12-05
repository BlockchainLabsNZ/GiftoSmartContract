pragma solidity ^0.4.18;

import "./ERC20Interface.sol";

contract Gifto is ERC20Interface {
    uint public constant decimals = 5;

    string public constant symbol = "Gifto";
    string public constant name = "Gifto";

    bool public _selling = false;//initial not selling
    uint public _totalSupply = 10 ** 14; // total supply is 10^14 unit, equivalent to 10^9 Gifto
    uint public _originalBuyPrice = 3 * 10**8; // original buy 1ETH = 3000 Gifto = 3 * 10**8 unit

    // Owner of this contract
    address public owner;
 
    // Balances Gifto for each account
    mapping(address => uint256) balances;
    
    // Owner of account approves the transfer of an amount to another account
    mapping(address => mapping (address => uint256)) allowed;

    // List of approved investors
    mapping(address => bool) approvedInvestorList;
    
    // mapping Deposit
    mapping(address => uint256) deposit;
    
    // buyers buy token deposit
    address[] buyers;
    
    // icoPercent
    uint _icoPercent = 10;
    
    // _icoSupply is the avalable unit. Initially, it is _totalSupply
    uint public _icoSupply = _totalSupply * _icoPercent / 100;
    
    // minimum buy 0.3 ETH
    uint public _minimumBuy = 3 * 10 ** 17;
    
    // maximum buy 30 ETH
    uint public _maximumBuy = 30 * 10 ** 18;
    
    /**
     * Functions with this modifier can only be executed by the owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * Functions with this modifier can only be executed by users except owners
     */
    modifier onlyNotOwner() {
        require(msg.sender != owner);
        _;
    }

    /**
     * Functions with this modifier check on sale status
     * Only allow sale if _selling is on
     */
    modifier onSale() {
        require(_selling && (_icoSupply > 0) );
        _;
    }
    
    /**
     * Functions with this modifier check the validity of address is investor
     */
    modifier validInvestor() {
        require(approvedInvestorList[msg.sender]);
        _;
    }
    
    /**
     * Functions with this modifier check the validity of msg value
     * value must greater than equal minimumBuyPrice
     * total deposit must less than equal maximumBuyPrice
     */
    modifier validValue(){
        // require value >= _minimumBuy AND total deposit of msg.sender <= maximumBuyPrice
        require ( (msg.value >= _minimumBuy) &&
                ( (deposit[msg.sender] + msg.value) <= _maximumBuy) );
        _;
    }
    
    /**
     * Functions with this modifier check the validity of range [a, b] <= [0, buyers.length-1]
     */
    modifier validRange(uint a, uint b){
        require ( (a>=0 && a<=b) &&
                  (b<buyers.length) );
        _;
    }

    /// @dev Fallback function allows to buy ether.
    function()
        public
        payable {
        buyGifto();
    }
    
    /// @dev buy function allows to buy ether. for using optional data
    function buyGifto()
        public
        payable
        onSale
        validValue
        validInvestor {
        // check the first buy => push to Array
        if (deposit[msg.sender] == 0){
            // add new buyer to List
            buyers.push(msg.sender);
        }
        // increase amount deposit of buyer
        deposit[msg.sender] += msg.value;
        // transfer value directly for owner
        owner.transfer(msg.value);
    }

    /// @dev Constructor
    function Gifto() 
        public {
        owner = msg.sender;
        // buyers = new address[](1);
        balances[owner] = _totalSupply;
        Transfer(0x0, owner, _totalSupply);
    }
    
    /// @dev Gets totalSupply
    /// @return Total supply
    function totalSupply()
        public 
        constant 
        returns (uint256) {
        return _totalSupply;
    }
    
    /// @dev Enables sale 
    function turnOnSale() onlyOwner 
        public {
        _selling = true;
    }

    /// @dev Disables sale
    function turnOffSale() onlyOwner 
        public {
        _selling = false;
    }
    
    /// @dev set new icoPercent
    /// @param newIcoPercent new value of icoPercent
    function setIcoPercent(uint256 newIcoPercent)
        public 
        onlyOwner {
        _icoPercent = newIcoPercent;
        _icoSupply = _totalSupply * _icoPercent / 100;
    }
    
    /// @dev set new _maximumBuy
    /// @param newMaximumBuy new value of _maximumBuy
    function setMaximumBuy(uint256 newMaximumBuy)
        public 
        onlyOwner {
        _maximumBuy = newMaximumBuy;
    }

    /// @dev Updates buy price (owner ONLY)
    /// @param newBuyPrice New buy price (in unit)
    function setBuyPrice(uint newBuyPrice) 
        onlyOwner 
        public {
        require(newBuyPrice>0);
        _originalBuyPrice = newBuyPrice;
        // control _maximumBuy is 10,000 USD, Gifto price is 0.1USD
        // proposed: 1 ETH = 300USD => 1 ETH = 3000 Gifto = _originalBuyPrice,
        // _maximumBuy = 10,000 / 300 = 100,000 / _originalBuyPrice ~ 33 ETH
        _maximumBuy = 100000 * 10**18 /_originalBuyPrice;
    }
        
    /// @dev Gets account's balance
    /// @param _addr Address of the account
    /// @return Account balance
    function balanceOf(address _addr) 
        public
        constant 
        returns (uint256) {
        return balances[_addr];
    }
    
    /// @dev check address is approved investor
    /// @param _addr address
    function isApprovedInvestor(address _addr)
        public
        constant
        returns (bool) {
        return approvedInvestorList[_addr];
    }
    
    /// @dev get investors deposited
    function getBuyers()
    public
    constant
    returns(address[]){
        return buyers;
    }
    
    /// @dev get ETH deposit
    /// @param _addr address get deposit
    /// @return amount deposit of an buyer
    function getDeposit(address _addr)
        public
        constant
        returns(uint256){
        return deposit[_addr];
    }
    
    /// @dev Adds list of new investors to the investors list and approve all
    /// @param newInvestorList Array of new investors addresses to be added
    function addInvestorList(address[] newInvestorList)
        onlyOwner
        public {
        for (uint i = 0; i < newInvestorList.length; i++){
            approvedInvestorList[newInvestorList[i]] = true;
        }
    }

    /// @dev Removes list of investors from list
    /// @param investorList Array of addresses of investors to be removed
    function removeInvestorList(address[] investorList)
        onlyOwner
        public {
        for (uint i = 0; i < investorList.length; i++){
            approvedInvestorList[investorList[i]] = false;
        }
    }
    
    /// @dev delivery token for buyer
    /// @param a start point
    /// @param b end point
    function deliveryToken(uint a, uint b)
        public
        onlyOwner
        validRange(a, b) {
        // make sure balances owner greater than _icoSupply
        require(balances[owner] >= _icoSupply);
        for (uint i = a; i <= b; i++){
            if(approvedInvestorList[buyers[i]]){
                // compute amount token of each buyer
                uint256 requestedUnits = (deposit[buyers[i]] * _originalBuyPrice) / 10**18;
                
                //check requestedUnits > _icoSupply
                if(requestedUnits <= _icoSupply && requestedUnits > 0 ){
                    // prepare transfer data
                    balances[owner] -= requestedUnits;
                    balances[buyers[i]] += requestedUnits;
                    _icoSupply -= requestedUnits;
                    
                    // submit transfer
                    Transfer(owner, buyers[i], requestedUnits);
                    
                    // reset deposit of buyer
                    deposit[buyers[i]] = 0;
                }
            }
        }
    }
 
    /// @dev Transfers the balance from Multisig wallet to an account
    /// @param _to Recipient address
    /// @param _amount Transfered amount in unit
    /// @return Transfer status
    function transfer(address _to, uint256 _amount)
        public 
        returns (bool) {
        // if sender's balance has enough unit and amount >= 0, 
        //      and the sum is not overflow,
        // then do transfer 
        if ( (balances[msg.sender] >= _amount) &&
             (_amount >= 0) && 
             (balances[_to] + _amount > balances[_to]) ) {  

            balances[msg.sender] -= _amount;
            balances[_to] += _amount;
            Transfer(msg.sender, _to, _amount);
            return true;
        } else {
            return false;
        }
    }
     
    // Send _value amount of tokens from address _from to address _to
    // The transferFrom method is used for a withdraw workflow, allowing contracts to send
    // tokens on your behalf, for example to "deposit" to a contract address and/or to charge
    // fees in sub-currencies; the command should fail unless the _from account has
    // deliberately authorized the sender of the message via some mechanism; we propose
    // these standardized APIs for approval:
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    )
    public
    returns (bool success) {
        if (balances[_from] >= _amount
            && allowed[_from][msg.sender] >= _amount
            && _amount > 0
            && balances[_to] + _amount > balances[_to]) {
            balances[_from] -= _amount;
            allowed[_from][msg.sender] -= _amount;
            balances[_to] += _amount;
            Transfer(_from, _to, _amount);
            return true;
        } else {
            return false;
        }
    }
    
    // Allow _spender to withdraw from your account, multiple times, up to the _value amount.
    // If this function is called again it overwrites the current allowance with _value.
    function approve(address _spender, uint256 _amount) 
        public
        returns (bool success) {
        allowed[msg.sender][_spender] = _amount;
        Approval(msg.sender, _spender, _amount);
        return true;
    }
    
    // get allowance
    function allowance(address _owner, address _spender) 
        public
        constant 
        returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
    
    /// @dev Withdraws Ether in contract (Owner only)
    /// @return Status of withdrawal
    function withdraw() onlyOwner 
        public 
        returns (bool) {
        return owner.send(this.balance);
    }
}
