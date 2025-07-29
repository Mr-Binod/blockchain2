// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract Lock {
    mapping(address => uint) public AccountLockValue;
    uint public totalValue;

    event Locked(address indexed _account, uint _value);

    function lock() external payable {
        require(msg.value > 0);

        AccountLockValue[msg.sender] += msg.value;
        totalValue += msg.value;

        emit Locked(msg.sender, msg.value);
    }

    function unlock(address _account, uint _value) external {
        require(AccountLockValue[_account] >= _value);

        AccountLockValue[_account] -= _value;
        totalValue -= _value;

        (bool success, ) = payable(_account).call{value : _value}('');
        require(success);
    }

}