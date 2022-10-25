// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {

    uint256 public tokenCount;
    uint256 public postCount;


    mapping(address => uint) public profiles;
    mapping(uint256 => Post) public posts;
    mapping(uint256 => Bio) public bios;
    mapping(uint256 => Items) public items;

    struct Post {
        uint id;
        string hash;
        address payable author;
    }

    event PostCreated(
        uint id,
        string hash,
        address payable author
    );

    struct Bio {
        string bio;
    }

    struct Items {
        uint hat;
        uint sword;
    }


    constructor() ERC721("Dapp NFT", "Kek"){}

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount ++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        profiles[msg.sender] = tokenCount;
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

    function uploadPost(string memory _postHash) external {
        require(
            balanceOf(msg.sender) > 0,
            "Must own a decentratwitter nft to post"
        );
        require(bytes(_postHash).length > 0, "Cannot pass an empty hash");
        postCount++;
        posts[postCount] = Post(postCount, _postHash, payable(msg.sender));
        emit PostCreated(postCount, _postHash, payable(msg.sender));
    }

    function setProfile(uint256 _id) public {
        require(
            ownerOf(_id) == msg.sender,
            "You must own the nft to make it your profile"
        );
        profiles[msg.sender] = _id;
    }    

    function changeBio(uint256 _id, string memory _bio) external {
        require(
            balanceOf(msg.sender) > 0,
            "Must own a decentratwitter nft to post"
        );
        require(bytes(_bio).length > 0, "Cannot pass an empty hash");
        bios[_id].bio = _bio;
    }

    function getAllPosts() external view returns (Post[] memory _posts) {
        _posts = new Post[](postCount);
        for (uint256 i = 0; i < _posts.length; i++) {
            _posts[i] = posts[i + 1];
        }
    }

}