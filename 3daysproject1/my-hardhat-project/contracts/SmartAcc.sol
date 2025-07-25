// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SmartAcc {
    address owner;
    address entryPoint;

    constructor(address _owner, address _entryPoint) {
        owner = _owner;
        entryPoint = _entryPoint;
    }

    modifier onlyOwner(address _owner) {
        require(owner == _owner);
        _;
    }

    modifier onlyEntryPoint() {
        require(msg.sender == entryPoint);
        _;
    }

    function execute(
        address contractAddress,
        uint value,
        bytes calldata data
    ) external onlyEntryPoint {
        (bool success, ) = contractAddress.call{value: value}(data);
        require(success);
    }

    function isValidSignature(
        bytes32 _hash,
        bytes calldata signature

    ) external view returns (bool) {
        address recovered = _recoverSigner(_hash, signature);
        return recovered == owner;
    }

    function _recoverSigner(bytes32 _hash, bytes memory signature) internal pure returns(address) {
        (bytes32 r, bytes32 s, uint8 v) = _splitSign(signature);
        return ecrecover(_hash, v, r, s);
    }

    function _splitSign(bytes memory signature) internal pure returns(bytes32 r, bytes32 s, uint8 v ) {
        require(signature.length == 65);
        assembly{
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
    }

    receive() external payable {}
}
