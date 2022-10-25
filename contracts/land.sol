// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Land is ERC721URIStorage, ReentrancyGuard, Ownable {

    uint256 public tokenCount;
    string public image;

    mapping(uint256 => string) public images;
    mapping(uint256 => uint256) public staked;
    mapping(uint256 => bool) public open;
    mapping(uint256 => uint256) public times;


    constructor() ERC721("Land NFT", "Land"){}

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount ++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        open[tokenCount] = true;
        staked[tokenCount] = 0;
        return(tokenCount);
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
 
    function changeImage(uint256 _id, string memory _image) external {
        require(
            balanceOf(msg.sender) > 0,
            "Must own a decentratwitter nft to post"
        );
        require(bytes(_image).length > 0, "Cannot pass an empty hash");
        images[_id] = _image;
    }

    function stake(IERC721 _nft, uint _landId, uint _nftId) external nonReentrant {
        require(open[_landId]);
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _nftId);
        // add new item to items mapping
        staked[_landId] = _nftId;
        open[_landId] = false;
        times[_landId] = block.timestamp;
    }

    function unStake(IERC721 _nft, uint _landId, uint _nftId) external nonReentrant {
        _nft.transferFrom(address(this), msg.sender, _nftId);
        staked[_landId] = 0;
        open[_landId] = true;
        times[_landId] = 0;
    }

    function duration(uint256 _landId) external view returns (uint _duration) {
        _duration = block.timestamp - times[_landId];
    }




    



}