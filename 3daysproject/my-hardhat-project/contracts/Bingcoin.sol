// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Bingtoken is ERC20 {
    constructor(string memory name, string memory sym ) ERC20(name, sym) {}
    function mint(address account, uint value) external {
        _mint(account, value);
    }
    

    function transfer(address from, address sendto, uint amount) public {
    // msg.sender pays the gas
    _transfer(from, sendto, amount);
}

   
}