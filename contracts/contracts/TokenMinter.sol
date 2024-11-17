// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFactory is Ownable {
    uint256 public creationFee = 0.01 ether; // Fee in MATIC for creating tokens

    // Events for token creation
    event ERC20Created(address indexed creator, address tokenAddress, string name, string symbol, uint256 supply, string description, string imageUrl);
    event ERC721Created(address indexed creator, address tokenAddress, string name, string symbol, string description, string imageUrl);

    constructor() {}

    // Update creation fee
    function setCreationFee(uint256 newFee) external onlyOwner {
        creationFee = newFee;
    }

    // Create ERC20 token
    function createERC20(
        string memory name,
        string memory symbol,
        uint256 supply,
        string memory description,
        string memory imageUrl
    ) external payable {
        require(msg.value >= creationFee, "Insufficient fee");

        // Deploy new ERC20 token
        ERC20Token newToken = new ERC20Token(name, symbol, msg.sender, supply);
        emit ERC20Created(msg.sender, address(newToken), name, symbol, supply, description, imageUrl);

        // Transfer the creation fee to the owner
        payable(owner()).transfer(msg.value);
    }

    // Create ERC721 token
    function createERC721(
        string memory name,
        string memory symbol,
        string memory description,
        string memory imageUrl
    ) external payable {
        require(msg.value >= creationFee, "Insufficient fee");

        // Deploy new ERC721 token
        ERC721Token newToken = new ERC721Token(name, symbol, msg.sender);
        emit ERC721Created(msg.sender, address(newToken), name, symbol, description, imageUrl);

        // Transfer the creation fee to the owner
        payable(owner()).transfer(msg.value);
    }

    // Withdraw collected fees
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

contract ERC20Token is ERC20 {
    string public description;
    string public imageUrl;

    constructor(
        string memory name,
        string memory symbol,
        address owner,
        uint256 supply
    ) ERC20(name, symbol) {
        description = "This is a custom ERC20 token"; // A default description, can be overridden in the minting function
        imageUrl = ""; // Placeholder for an image URL
        _mint(owner, supply * 10**decimals());  // Ensuring the supply is in the right precision
    }
}

contract ERC721Token is ERC721 {
    uint256 public nextTokenId;
    address public admin;
    string public description;
    string public imageUrl;

    constructor(
        string memory name,
        string memory symbol,
        address owner
    ) ERC721(name, symbol) {
        admin = owner;
    }

    // Minting function for ERC721
    function mint(address to) external {
        require(msg.sender == admin, "Only admin can mint");
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }
}
