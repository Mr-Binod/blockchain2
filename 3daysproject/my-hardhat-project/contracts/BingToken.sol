// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Bingtoken is ERC20 {
    constructor(string memory name, string memory sym ) ERC20(name, sym) {}

    event minted(address owner, uint value);

    function mint(address account, uint value) external {
        _mint(account, value);
        emit minted(account,value);
    }
    
}

   
