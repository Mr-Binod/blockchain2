// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./BingNFt.sol";

contract MetaBingNFT {
    BingNFT public bingNFT;
    address public owner;
    
    event NFTMinted(address indexed user, uint256 tokenId, uint256 amount, string metadata);
    
    constructor(address _bingNFTAddress) {
        bingNFT = BingNFT(_bingNFTAddress);
        owner = msg.sender;
    }
    
    // ✅ Meta-transaction for minting NFT
    // function mintNFT(
    //     address user,
    //     uint256 tokenId,
    //     uint256 amount,
    //     string memory metadata,
    //     bytes memory signature
    // ) external {
    //     // Verify signature
    //     _verifySignature(user, metadata, signature);
        
    //     // Mint NFT to user
    //     // bingNFT.mint(user, tokenId, amount, "");
        
    //     emit NFTMinted(user, tokenId, amount, metadata);
    // }
    
    // // ✅ Batch mint NFTs
    // function mintBatchNFT(
    //     address user,
    //     uint256 tokenIds,
    //     uint256 amounts,
    //     string memory metadatas,
    //     bytes memory signature
    // ) external {
    //     // Verify signature for first metadata (or create combined metadata)
    //     // string memory combinedMetadata = _combineMetadata(metadatas);
    //     _verifySignature(user, metadatas, signature);
        
    //     // Mint batch NFTs to user
    //     // bingNFT.mintBatch(user, tokenIds, amounts, "");
        
    //     // Emit events for each NFT
    //      emit NFTMinted(user, tokenIds, amounts, metadatas);
    //     // for (uint i = 0; i < tokenIds.length; i++) {
    //     //     emit NFTMinted(user, tokenIds[i], amounts[i], metadatas[i]);
    //     // }
    // }
    
    // ✅ Set token URI (only owner)
    function setTokenURI(string memory newURI, address sender) external {
        require(msg.sender == owner, "Only owner can set URI");
        bingNFT.settokenURI(newURI, sender);
    }
    
    // ✅ Verify signature
    function _verifySignature(
        address user,
        string memory metadata,
        bytes memory signature
    ) internal pure {
        bytes32 messageHash = _getEthSignMsgHash(metadata);
        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(signature);
        
        address recoveredAddress = ecrecover(messageHash, v, r, s);
        require(recoveredAddress == user, "Invalid signature");
    }
    
    // ✅ Get Ethereum signed message hash
    function _getEthSignMsgHash(string memory metadata) internal pure returns (bytes32) {
        bytes32 messageHash = keccak256(abi.encodePacked(metadata));
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", Strings.toString(bytes(metadata).length), metadata));
    }
    
    // ✅ Split signature into components
    function _splitSignature(bytes memory signature) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(signature.length == 65, "Invalid signature length");
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        if (v < 27) {
            v += 27;
        }
        
        require(v == 27 || v == 28, "Invalid signature 'v' value");
    }
    
    // ✅ Combine multiple metadata strings
    // function _combineMetadata(string memory metadatas) internal pure returns (string memory) {
    //     string memory combined = "";
    //     for (uint i = 0; i < metadatas.length; i++) {
    //         combined = string(abi.encodePacked(combined, metadatas[i]));
    //         if (i < metadatas.length - 1) {
    //             combined = string(abi.encodePacked(combined, "|"));
    //         }
    //     }
    //     return combined;
    // }
    
    // ✅ Transfer ownership
    function transferOwnership(address newOwner) external {
        require(msg.sender == owner, "Only owner can transfer ownership");
        owner = newOwner;
    }
    
    // ✅ Get contract info
    function getContractInfo() external view returns (address nftContract, address contractOwner) {
        return (address(bingNFT), owner);
    }

    // --- BingNFT state-changing function wrappers ---
    function settokenURI(string memory newuri) external {
        bingNFT.settokenURI(newuri, msg.sender);
    }

    function SellNFT(address sender, uint nftid, uint token, uint price) external {
        bingNFT.SellNFT(sender, nftid, token, price);
    }

    function BuyNFT( address receiver,  uint nftid, uint price) external  {
        bingNFT.BuyNFT( receiver, nftid, price);
    }
    // function BuyNFT(uint nftid) external payable {
    //     bingNFT.BuyNFT{value: msg.value}(nftid, msg.sender);
    // }

    function cancelSale(address sender, uint nftid ) external {
        bingNFT.cancelSale(nftid, sender);
    }

    // --- BingNFT view function wrappers ---
    function uri(uint256 tokenid) public view returns (string memory) {
        return bingNFT.uri(tokenid);
    }

    function getall(address sender, uint item) external view returns(BingNFT.Sellstake memory) {
        return bingNFT.getall(sender, item);
    }

    function getMintedTokens(address user) external view returns(uint[] memory tokenIds, uint[] memory amounts) {
        return bingNFT.getMintedTokens(user);
    }

    function getCurrentBalance(address user, uint tknId) external view returns(uint) {
        return bingNFT.getCurrentBalance(user, tknId);
    }

    function getAllTokenBalances(address user) external view returns(uint[] memory tokenIds, uint[] memory balances) {
        return bingNFT.getAllTokenBalances(user);
    }

    function getOwnerTokenCount(address user) external view returns(uint) {
        return bingNFT.getOwnerTokenCount(user);
    }

    function getOwnerTokenAtIndex(address user, uint index) external view returns(uint tokenId, uint amount) {
        return bingNFT.getOwnerTokenAtIndex(user, index);
    }

    function userTokens(address user) external view returns(uint[] memory) {
        return bingNFT.userTokens(user);
    }

    receive() external payable {}
} 