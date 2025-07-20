// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./Bingcoin.sol";



contract MetaTransaction {
    Bingtoken BingTKN;
    constructor(address _CA) {
        BingTKN = Bingtoken(_CA);
    }
    
    function mint(
        address accounts,
        uint tokens,
        string memory messages,
        bytes memory signature
    ) external {
     
            _Signtxn(accounts, messages, signature);
            BingTKN.mint(accounts, tokens);
        
    }

    function Send(address sender, address sendto, uint amount,string memory message,  bytes memory signature) external {
        _Signtxn(sender, message, signature);
        BingTKN.transfer(sender, sendto, amount);
    }

    function _Signtxn(
        address account,
        string memory _msg,
        bytes memory sign
    ) internal {
        bytes32 ethSign = _getEthSignMsgHash(_msg);
        (bytes32 r, bytes32 s, uint8 v) = _splitSign(sign);
        require(account == ecrecover(ethSign, v, r, s));
    }

    function _getEthSignMsgHash(string memory _msg) internal pure returns(bytes32) {
        uint msgLth = bytes(_msg).length;
        return
        keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n",
                    Strings.toString(msgLth),
                    _msg
                )
            );
    }

    function _splitSign(bytes memory sign) internal pure returns(bytes32 r, bytes32 s, uint8 v) {
        require(sign.length == 65);
        assembly {
            r := mload(add(sign, 32))
            s := mload(add(sign, 64))
            v := byte(0, mload(add(sign, 96)))
        }
        if (v < 27) {
            v += 27;
            require(v == 27 || v == 28);
        }
    }
}