// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;


import "./SmartAcc.sol";


contract SmartFactory {
    
    address immutable entryPoint;

    mapping(address => address) private accounts;

    constructor(address _entryPoint) {
        entryPoint = _entryPoint;
    }

    function createAcc(address owner) external returns(address smartAcc) {
        require(accounts[owner] == address(0));

        bytes memory bytecode = abi.encodePacked(
            type(SmartAcc).creationCode,
            abi.encode(owner,entryPoint)
        );

        bytes32 salt = keccak256(abi.encodePacked(owner, block.timestamp));

        assembly {
            smartAcc := create2(0, 
            add(bytecode, 32),
            mload(bytecode),
            salt
            )
            if iszero(extcodesize(smartAcc)) {
                revert(0, 0)
            }
        }
        accounts[owner] = smartAcc;
    }

    function getAccount(address owner) external view returns(address) {
        return accounts[owner];
    }


}