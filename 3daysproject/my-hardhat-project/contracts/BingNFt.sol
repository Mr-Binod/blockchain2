// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BingNFT is ERC1155, Ownable {
    // Removed unused variable
    struct Sellstake {
        address seller;
        uint token;
        uint price;
    }

    mapping(uint => Sellstake) public items;
    mapping(address => mapping(uint => uint)) private ownerNfts;
    mapping(address => uint[]) private userTokenIds;
    mapping(uint256 => string) private _uris;

    uint[] public listNFTids;
    uint private tokenId;
    string private initialURI = "https://myproject.com/metadata/{id}.json";
    
    constructor() ERC1155(initialURI) Ownable(msg.sender) {
        // No need for external address parameter
    }

    function settokenURI(string memory newuri, address sender) external returns (uint) {
        uint createdTokenId = tokenId;
        _mint(sender, createdTokenId, 100, "");
        _uris[createdTokenId] = newuri;
        ownerNfts[sender][createdTokenId] = 100;
        _addTokenIdToUser(sender, createdTokenId);
        tokenId++;
        return createdTokenId;
    }

    function SellNFT(address sender, uint nftid, uint token, uint price) external {
        require(balanceOf(sender, nftid) >= token, "Insufficient tokens");
        require(price > 0, "Price must be greater than 0");
        require(items[nftid].seller == address(0), "NFT already for sale");
        require(token > 0, "Must sell at least 1 token");
        _safeTransferFrom(sender, address(this), nftid, token, "");
        require(ownerNfts[sender][nftid] >= token, "Not enough tokens");
        ownerNfts[sender][nftid] -= token;
        items[nftid] = Sellstake(sender, token, price);
        listNFTids.push(nftid);
    }

    function BuyNFT(uint nftid, address sender) external payable {
        Sellstake memory item = items[nftid];
        require(item.price == msg.value, "Incorrect price");
        require(sender != item.seller, "Cannot buy your own NFT");
        require(item.seller != address(0), "NFT not for sale");
        _safeTransferFrom(address(this), sender, nftid, item.token, "");
        payable(item.seller).transfer(msg.value);
        ownerNfts[sender][nftid] += item.token;
        _addTokenIdToUser(sender, nftid);
        delete items[nftid];
    }

    function cancelSale(uint nftid, address sender) external {
        Sellstake memory item = items[nftid];
        require(item.seller == sender, "Only seller can cancel");
        require(item.seller != address(0), "NFT not for sale");
        _safeTransferFrom(address(this), sender, nftid, item.token, "");
        ownerNfts[sender][nftid] += item.token;
        _addTokenIdToUser(sender, nftid);
        delete items[nftid];
    }

    function _addTokenIdToUser(address user, uint tokenid) internal {
        uint[] storage ids = userTokenIds[user];
        for (uint i = 0; i < ids.length; i++) {
            if (ids[i] == tokenid) {
                return;
            }
        }
        ids.push(tokenId);
    }

    function uri(uint256 tokenid) public view virtual override returns (string memory) {
        string memory customUri = _uris[tokenid];
        if (bytes(customUri).length > 0) {
            return customUri;
        }
        string memory tokenIdStr = Strings.toString(tokenid);
        return string(abi.encodePacked("https://myproject.com/metadata/", tokenIdStr, ".json"));
    }

    function getall(uint item) external view returns(Sellstake memory) {
        return items[item];
    }

    function getMintedTokens(address user) external view returns(uint[] memory tokenIds, uint[] memory amounts) {
        uint[] memory ids = userTokenIds[user];
        tokenIds = new uint[](ids.length);
        amounts = new uint[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            tokenIds[i] = ids[i];
            amounts[i] = ownerNfts[user][ids[i]];
        }
        return (tokenIds, amounts);
    }

    function getCurrentBalance(address user, uint tknId) external view returns(uint) {
        return ownerNfts[user][tknId];
    }

    function getAllTokenBalances(address user) external view returns(uint[] memory tokenIds, uint[] memory balances) {
        uint[] memory ids = userTokenIds[user];
        tokenIds = new uint[](ids.length);
        balances = new uint[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            tokenIds[i] = ids[i];
            balances[i] = ownerNfts[user][ids[i]];
        }
        return (tokenIds, balances);
    }

    function getOwnerTokenCount(address user) external view returns(uint) {
        return userTokenIds[user].length;
    }

    function getOwnerTokenAtIndex(address user, uint index) external view returns(uint tokenid, uint amount) {
        require(index < userTokenIds[user].length, "Index out of bounds");
        tokenid = userTokenIds[user][index];
        amount = ownerNfts[user][tokenId];
    }

    function userTokens(address user) external view returns(uint[] memory) {
        return userTokenIds[user];
    }
}

// How to "Get" It:

// During Deployment: You explicitly provide this string when you deploy the contract. For example, if you're using a tool like Hardhat, Truffle, or Remix, you'll enter this string in the deployment interface.

// Example: deploy("https://myproject.com/metadata/{id}.json", deployerAddress)

// After Deployment (via uri function): You can query the uri(uint256 id) public function of your deployed contract. If no specific URI has been set for a given id using setTokenURI, this function will return the initialURI (potentially with the {id} placeholder replaced).
