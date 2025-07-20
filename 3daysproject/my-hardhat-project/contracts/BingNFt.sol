// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract BingNFT is ERC1155, Ownable, IERC1155Receiver {
    // Removed unused variable
    struct Sellstake {
        address seller;
        uint token;
        uint price;
    }

    mapping(uint => Sellstake[]) public items;
    mapping(address => mapping(uint => uint)) private ownerNfts;
    mapping(address => uint[]) private userTokenIds;
    mapping(uint256 => string) private _uris;

    uint[] public listNFTids;
    uint private tokenId;
    string private initialURI = "https://myproject.com/metadata/{id}.json";

    event sellItemLists(address seller, uint token, uint price);

    constructor() ERC1155(initialURI) Ownable(msg.sender) {
        // No need for external address parameter
    }

    function settokenURI(
        string memory newuri,
        address sender
    ) external returns (uint) {
        uint createdTokenId = tokenId;
        _mint(sender, createdTokenId, 100, "");
        _uris[createdTokenId] = newuri;
        ownerNfts[sender][createdTokenId] = 100;
        _addTokenIdToUser(sender, createdTokenId);
        tokenId++;
        return createdTokenId;
    }

    function SellNFT(
        address sender,
        uint256 nftid,
        uint256 token,
        uint price
    ) external {
        require(balanceOf(sender, nftid) >= token, "Insufficient tokens");
        require(price > 0, "Price must be greater than 0");
        // require(items[nftid].seller == address(0), "NFT already for sale");
        require(token > 0, "Must sell at least 1 token");
        require(ownerNfts[sender][nftid] >= token, "Not enough tokens");
        _safeTransferFrom(sender, address(this), nftid, token, "");
        ownerNfts[sender][nftid] -= token;
        items[nftid].push(Sellstake(sender, token, price));
        listNFTids.push(nftid);
        emit sellItemLists(sender, token, price);
    }

    function getSellItem(
        uint nftid,
        uint token,
        uint price
    ) public view returns (Sellstake memory) {
        Sellstake[] memory stakes = items[nftid];
        for (uint i = 0; i < stakes.length; i++) {
            if (stakes[i].token == token && stakes[i].price == price) {
                return stakes[i];
            }
        }
        revert("Sellstake not found");
    }
    // function BuyNFT(uint256 nftid, address sender, uint token, uint price) external payable {
    //     Sellstake memory item = getSellItem(nftid, token, price);
    //     require(item.price == price, "Incorrect price");
    //     require(sender != item.seller, "Cannot buy your own NFT");
    //     require(item.seller != address(0), "NFT not for sale");
    //     _safeTransferFrom(address(this), sender, nftid, item.token, "");
    //     payable(item.seller).transfer(msg.value);
    //     ownerNfts[sender][nftid] += item.token;
    //     _addTokenIdToUser(sender, nftid);
    //     delete items[nftid];
    // }

    // function cancelSale(uint256 nftid, address sender) external {
    //     Sellstake memory item = getSellItem(nftid, token, price);;
    //     require(item.seller == sender, "Only seller can cancel");
    //     require(item.seller != address(0), "NFT not for sale");
    //     _safeTransferFrom(address(this), sender, nftid, item.token, "");
    //     ownerNfts[sender][nftid] += item.token;
    //     _addTokenIdToUser(sender, nftid);
    //     delete items[nftid];
    // }

    function BuyNFT(
        uint256 nftid,
        address sender,
        uint token,
        uint price
    ) external payable {
        Sellstake[] storage stakes = items[nftid];
        bool found = false;
        uint index;
        for (uint i = 0; i < stakes.length; i++) {
            if (stakes[i].token == token && stakes[i].price == price) {
                require(price == stakes[i].price, "Incorrect price");
                require(sender != stakes[i].seller, "Cannot buy your own NFT");
                require(stakes[i].seller != address(0), "NFT not for sale");
                _safeTransferFrom(address(this), sender, nftid, token, "");
                // payable(stakes[i].seller).transfer(msg.value);
                ownerNfts[sender][nftid] += token;
                _addTokenIdToUser(sender, nftid);
                index = i;
                found = true;
                break;
            }
        }
        require(found, "Sellstake not found");
        if (stakes.length > 1) {
            stakes[index] = stakes[stakes.length - 1];
        }
        stakes.pop();
    }

    function cancelSale(
        uint256 nftid,
        uint token,
        uint price,
        address sender
    ) external {
        Sellstake[] storage stakes = items[nftid];
        bool found = false;
        uint index;
        for (uint i = 0; i < stakes.length; i++) {
            if (
                stakes[i].token == token &&
                stakes[i].price == price &&
                stakes[i].seller == sender
            ) {
                found = true;
                index = i;
                break;
            }
        }
        require(found, "Sell item not found");
        _safeTransferFrom(address(this), sender, nftid, token, "");
        ownerNfts[sender][nftid] += token;
        _addTokenIdToUser(sender, nftid);
        if (stakes.length > 1) {
            stakes[index] = stakes[stakes.length - 1];
        }
        stakes.pop();
    }

    function _addTokenIdToUser(address user, uint tokenid) internal {
        uint[] storage ids = userTokenIds[user];
        for (uint i = 0; i < ids.length; i++) {
            if (ids[i] == tokenid) {
                return;
            }
        }
        ids.push(tokenid); // Fixed: was tokenId, should be tokenid
    }

    function uri(
        uint256 tokenid
    ) public view virtual override returns (string memory) {
        string memory customUri = _uris[tokenid];
        if (bytes(customUri).length > 0) {
            return customUri;
        }
        string memory tokenIdStr = Strings.toString(tokenid);
        return
            string(
                abi.encodePacked(
                    "https://myproject.com/metadata/",
                    tokenIdStr,
                    ".json"
                )
            );
    }

    function getall(uint item) external view returns (Sellstake[] memory) {
        return items[item];
    }

    function getMintedTokens(
        address user
    ) external view returns (uint[] memory tokenIds, uint[] memory amounts) {
        uint[] memory ids = userTokenIds[user];
        tokenIds = new uint[](ids.length);
        amounts = new uint[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            tokenIds[i] = ids[i];
            amounts[i] = ownerNfts[user][ids[i]];
        }
        return (tokenIds, amounts);
    }

    function getCurrentBalance(
        address user,
        uint tknId
    ) external view returns (uint) {
        return ownerNfts[user][tknId];
    }

    function getAllTokenBalances(
        address user
    ) external view returns (uint[] memory tokenIds, uint[] memory balances) {
        uint[] memory ids = userTokenIds[user];
        tokenIds = new uint[](ids.length);
        balances = new uint[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            tokenIds[i] = ids[i];
            balances[i] = ownerNfts[user][ids[i]];
        }
        return (tokenIds, balances);
    }

    function getOwnerTokenCount(address user) external view returns (uint) {
        return userTokenIds[user].length;
    }

    function getOwnerTokenAtIndex(
        address user,
        uint index
    ) external view returns (uint tokenid, uint amount) {
        require(index < userTokenIds[user].length, "Index out of bounds");
        tokenid = userTokenIds[user][index];
        amount = ownerNfts[user][tokenid]; // Fixed: was tokenId, should be tokenid
    }

    function userTokens(address user) external view returns (uint[] memory) {
        return userTokenIds[user];
    }

    // function getTotalTokensForNFTId(
    //     uint nftid
    // ) external view returns (uint totalTokens) {
    //     // Check if this nftid is currently listed
    //     if (items[nftid].seller != address(0)) {
    //         totalTokens += items[nftid].token;
    //     }
    // }

    // function getTotalValueForNFTId(
    //     uint nftid
    // ) external view returns (uint totalValue) {
    //     if (items[nftid].seller != address(0)) {
    //         totalValue = items[nftid].price * items[nftid].token;
    //     }
    // }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        // Return the magic value to accept the transfer
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        // Return the magic value to accept the batch transfer
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155, IERC165) returns (bool) {
        return
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}

// How to "Get" It:

// During Deployment: You explicitly provide this string when you deploy the contract. For example, if you're using a tool like Hardhat, Truffle, or Remix, you'll enter this string in the deployment interface.

// Example: deploy("https://myproject.com/metadata/{id}.json", deployerAddress)

// After Deployment (via uri function): You can query the uri(uint256 id) public function of your deployed contract. If no specific URI has been set for a given id using setTokenURI, this function will return the initialURI (potentially with the {id} placeholder replaced).
