// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

interface IBingToken {
    function balanceOf(address) external view returns (uint);
}

contract PayMaster {
    address public immutable entryPoint;
    address public immutable token;
    address public immutable owner;

    mapping(address => bool) public whiteList;

    uint constant TknAmt = 10 ** 18;
    uint constant MaxCost = 0.01 ether;

    constructor(address _entryPoint, address _token) {
        entryPoint = _entryPoint;
        token = _token;
        owner = msg.sender;
    }

    modifier onlyEntryPoing() {
        require(msg.sender == entryPoint);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function whiteListAdd(address account) external onlyOwner {
        whiteList[account] = true;
    }

    function whiteListRemove(address account) external onlyOwner {
        whiteList[account] = false;
    }

    function validatePaymasterTknUserOp(
        address account,
        uint maxCost
    ) external view returns(bool) {
        require(whiteList[account]);
        uint balance = IBingToken(token).balanceOf(account);
        require(balance >= TknAmt);
        require(MaxCost >= maxCost);
        return true;
    }
}
