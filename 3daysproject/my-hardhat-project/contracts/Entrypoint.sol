// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract EntryPoint {

    event UserOpCompleted(address indexed sender, bool success);

    struct UserOperation {
        address sender;
        uint nonce;
        bytes initCode;
        bytes callData;
        uint callGasLimit;
        uint verificationGasLimit;
        uint preVerificationGas;
        uint maxFeePerGas;
        uint maxPriorityFeePerGas;
        bytes paymasterAndData;
        bytes signature;
    }

    mapping(address => uint) public nonces;

    function handleOps(UserOperation[] calldata ops) external {
        for (uint256 i = 0; i < ops.length; i++) {
            UserOperation calldata op = ops[i];
            require(op.nonce == nonces[op.sender], "nonce error");

            bytes32 _hash = _getUserOpHash(op);
            bytes32 ethSignature = _toSignMsgHash(_hash);
            (bool success, ) = op.sender.call(
                abi.encodeWithSignature("isValidSignature(bytes32,bytes)",
                    ethSignature,
                    op.signature
                )
            );
            require(success, "isValidSignature Error");

            (bool isActive, ) = op.sender.call{gas:op.callGasLimit}(op.callData);
            emit UserOpCompleted(op.sender, isActive);
            nonces[op.sender]++;
        }
    }

    function _getUserOpHash(
        UserOperation calldata op
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    op.sender,
                    op.nonce,
                    keccak256(op.initCode),
                    keccak256(op.callData),
                    op.callGasLimit,
                    op.verificationGasLimit,
                    op.preVerificationGas,
                    op.maxFeePerGas,
                    op.maxPriorityFeePerGas,
                    keccak256(op.paymasterAndData),
                    keccak256(op.signature)
                )
            );
    }

    function _toSignMsgHash(bytes32 _hash) internal pure returns(bytes32) {
        return keccak256((abi.encodePacked(
            "\x19Ethereum Signed Message:\n",
            _hash
        )));
    }
}
