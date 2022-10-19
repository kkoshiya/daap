// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Mando is ERC721URIStorage {

    uint256 public tokenCount;
    uint256 public postCount;

    mapping(uint256 => History) public histories;
    mapping(uint256 => Bio) public bios;

    struct Bounty {
        uint id;
        uint reward;
        address payable author;
    }

    struct History {
        uint totalBounties;
        uint openBounties;
        uint completedBounties;
        uint totalRewards;
    }

    struct Bio {
        string name;
        string github;
    }

    constructor() ERC721("Mando NFT", "Mando"){}

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount ++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        histories[tokenCount] = History(0, 0, 0, 0);
        return(tokenCount);
    }

    function setBio(uint256 _id, string memory _name, string memory _github) external {
        bios[_id] = Bio(_name, _github);
    }

    function getMyNfts() external view returns (uint256[] memory _ids) {
        _ids = new uint256[](balanceOf(msg.sender));
        uint256 currentIndex;
        uint256 _tokenCount = tokenCount;
        for (uint256 i = 0; i < _tokenCount; i++) {
            if (ownerOf(i + 1) == msg.sender) {
                _ids[currentIndex] = i + 1;
                currentIndex++;
            }
        }
    }

    function changeGithub(uint256 _id, string memory _github) external {
        require(
            balanceOf(msg.sender) > 0,
            "Must own an nft to post"
        );
        require(bytes(_github).length > 0, "Cannot pass an empty username");
        bios[_id].github = _github;
    }



}