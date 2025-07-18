// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;


contract SmartAccount {
    address owner;
    address entryPoint; // handleOps 
    constructor(address _owner, address _entryPoint) {
        owner = _owner;
        entryPoint = _entryPoint;
    }

    modifier onlyEntryPoint() {
        require(msg.sender == entryPoint);
        _;
    }

    modifier onlyOwner(address _owner) {
        require(owner == _owner);
        _;
    }

    function execute(address sendto, uint value, bytes calldata data) external onlyEntryPoint() {
        // address to 호출할 주소 => 컨트랙트 주소 혹은 EOA
        // data는 호출할 주소가 컨트랙트일 경우 로직의 실행 내용 포함된다
        // value 전달하는 이더의 량 {} 메시지에 포함되는내용 추가 value
        // msg.value 객체로 값을 전달해준다 => 컨트랙트에 바이트 코등 전달
        (bool success,) = sendto.call{value : value}(data);
        // 내부 트랜잭션을 발생 시키는 것
        require(success);
    }

    function isValidSignature(bytes32 _hash, bytes calldata sig) external view returns (bool) {
        address recovered = _recoverSign(_hash, sig);
        return recovered == owner;
        // 서명검증 방식 확장자
    }

    function _recoverSign(bytes32 _hash, bytes memory sig) internal pure returns(address) {
        // 공개키로 복원
        (bytes32 r, bytes32 s, uint8 v) = _splitSign(sig);

        // 공개키 복원 함수
        return ecrecover(_hash, v, r, s);
    }   

    // r s v 
    function _splitSign(bytes memory sig) internal pure returns(bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65);
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

}