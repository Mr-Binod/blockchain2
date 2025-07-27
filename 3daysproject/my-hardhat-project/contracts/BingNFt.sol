// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract BingNFT is ERC1155, IERC1155Receiver {
    // Removed unused variable
    struct Sellstake {
        address seller;
        uint token;
        uint price;
    }
    struct SellList {
        address owner;
        uint nftid;
    }

    mapping(address => mapping(uint => Sellstake)) public items;
    mapping(address => mapping(uint => uint)) private ownerNfts;
    mapping(address => uint[]) private userTokenIds;
    mapping(uint256 => string) private _uris;

    event TokenURICreated(uint256 tokenId, address indexed sender, string uri);

    SellList[] public SellNftList;
    uint private tokenId;
    string private initialURI = "https://myproject.com/metadata/{id}.json";

    event createdItemLists(address seller, uint token, uint amount);
    event sellItemLists(address seller, uint token, uint tokenAmt, uint price);
    event buyItemLists(address seller, uint token, uint tokenAmt, uint price);

    constructor() ERC1155(initialURI) {
        // No need for external address parameter
    }

    function settokenURI(
        string memory newuri,
        address sender
    ) external returns (uint) {
        // function settokenURI(string memory newuri, address sender) external {
        uint createdTokenId = tokenId;
        _mint(sender, createdTokenId, 10, "");
        _uris[createdTokenId] = newuri;
        ownerNfts[sender][createdTokenId] = 10;
        tokenId++;
        emit TokenURICreated(createdTokenId, sender, newuri);
        emit createdItemLists(sender, createdTokenId, 10);

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
        require(
            items[sender][nftid].seller == address(0),
            "NFT already for sale"
        );
        require(token > 0, "Must sell at least 1 token");
        require(ownerNfts[sender][nftid] >= token, "Not enough tokens");
        _safeTransferFrom(sender, address(this), nftid, token, "");
        ownerNfts[sender][nftid] -= token;
        items[sender][nftid] = Sellstake(sender, token, price);
        SellNftList.push(SellList(sender, nftid));
        emit sellItemLists(sender, nftid, token, price);
    }

    function BuyNFT(
        address sender,
        address receiver,
        uint256 nftid,
        uint price
    ) external {
        Sellstake memory item = items[sender][nftid];
        require(item.price == price, "Incorrect price");
        require(receiver != item.seller, "Cannot buy your own NFT");
        require(item.seller != address(0), "NFT not for sale");
        _safeTransferFrom(address(this), receiver, nftid, item.token, "");
        // payable(item.seller).transfer(msg.value);
        ownerNfts[receiver][nftid] += item.token;
        delete items[sender][nftid];
        emit buyItemLists(sender, nftid, item.token, price);
    }

    function cancelSale(uint256 nftid, address sender) external {
        Sellstake memory item = items[sender][nftid];
        require(item.seller == sender, "Only seller can cancel");
        require(item.seller != address(0), "NFT not for sale");
        _safeTransferFrom(address(this), sender, nftid, item.token, "");
        ownerNfts[sender][nftid] += item.token;
        delete items[sender][nftid];
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

    function getAllListedNFTIds() external view returns (SellList[] memory) {
        return SellNftList;
    }

    function userTokens(address user) external view returns (uint[] memory) {
        return userTokenIds[user];
    }

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
    receive() external payable {}
}

// How to "Get" It:

// During Deployment: You explicitly provide this string when you deploy the contract. For example, if you're using a tool like Hardhat, Truffle, or Remix, you'll enter this string in the deployment interface.

// Example: deploy("https://myproject.com/metadata/{id}.json", deployerAddress)

// After Deployment (via uri function): You can query the uri(uint256 id) public function of your deployed contract. If no specific URI has been set for a given id using setTokenURI, this function will return the initialURI (potentially with the {id} placeholder replaced).
