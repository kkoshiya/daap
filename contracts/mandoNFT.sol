// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Mando is ERC721URIStorage, ReentrancyGuard{

    uint256 public tokenCount;
    uint256 public postCount;

    event IDMinted (address owner,uint tokenId,string name,string githubName);
    event Attest(address indexed to, uint256 indexed tokenId);
    event Revoke(address indexed to, uint256 indexed tokenId);

    mapping(uint256 => History) public histories;
    mapping(uint256 => Bio) public bios;

    struct History {
        uint totalBountiesIssued; //bounties issued
        uint openBounties;
        uint completedBountiesPayed; 
        uint completedBountiesEarned;
        uint totalRewardsPayed;
        uint totalRewardsEarned;
    }

    struct Bio {
        string name;
        string githubName;
        address walletAddress;
    }

    constructor() ERC721("Mando NFT", "Mando"){}

    function mint(string memory _tokenURI,string memory _name, string memory _githubName) external returns(uint) {
        require(balanceOf(msg.sender) < 1, "You can't own more than one ID");
        tokenCount ++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        bios[tokenCount] = Bio(_name, _githubName,msg.sender);
        histories[tokenCount] = History(0,0,0,0,0,0);
        return(tokenCount);
    }


    function _beforeTokenTransfer(address from, address to, uint256) pure override internal {
        require(from == address(0) || to == address(0), "Not allowed to transfer token");
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId) override internal {

        if (from == address(0)) {
            emit Attest(to, tokenId);
        } else if (to == address(0)) {
            emit Revoke(to, tokenId);
        }
    }

    // Bio setting can be set initially at the minting
    function setBio(uint256 _id, string memory _name, string memory _githubName) external {
        require(bios[_id].walletAddress == msg.sender,"You are not the owner of this ID");
        bios[_id].name = _name;
        bios[_id].githubName = _githubName;
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

    function changeGithubName(uint256 _id, string memory _githubName) external {
        require(
            balanceOf(msg.sender) > 0,
            "Must own an nft to post"
        );
        require(bytes(_githubName).length > 0, "Cannot pass an empty username");
        bios[_id].githubName = _githubName;
    }

    function changeName(uint256 _id, string memory _name) external {
        require(
            balanceOf(msg.sender) > 0,
            "Must own an nft to post"
        );
        require(bytes(_name).length > 0, "Cannot pass an empty username");
        bios[_id].name = _name;
    }

}

contract BountyContract is Mando {

    uint256 public postId;
    
    event BountyCreated(uint id,string name,string creatorProtocol,uint reward, address author);
    event BountyDeleted(uint id,address author);
    event BountyCompleted(uint id,address creator,string creatorProtocol,address bountyWinner);
    event HackerAccepted(uint id,address acceptedHacker);


    mapping(uint => Bounty) public bounties;

    struct Bounty {
        uint id;
        string name;
        string creatorProtocol;
        uint256 reward;
        address owner;
        bool isActive;
        address[] acceptedHackers;
        address bountyWinner;
        uint bountyCreationTime;
        uint bountyDeadlineTime; // optional
        // address payable acceptedHacker;
    }

    modifier onlyCreator (uint _postId) {
        require(bounties[_postId].owner == msg.sender,"You are not the creator of this bounty");
        _;
    }

    function createBounty(uint _tokenId, uint _reward, string memory _name, string memory _creatorProtocol) public {
        History storage history = histories[_tokenId];
        history.totalBountiesIssued ++;
        history.openBounties ++;
        postId ++;
        bounties[postId] = Bounty(postId,_name,_creatorProtocol,_reward,msg.sender,true, new address[](0),address(0),block.timestamp, block.timestamp);
        // uint reward = _reward/100; 

        // bounties[postId] = Bounty(postId,_name,_creatorProtocol,reward,payable(msg.sender),true, payable(msg.sender));
        emit BountyCreated(postId,_name,_creatorProtocol,_reward,msg.sender);
    }

    function editBounty(uint _reward,uint _postId) public onlyCreator(_postId){
        bounties[_postId].reward = _reward;
    }

    function setDeadline(uint _postId, uint _deadline) public onlyCreator(_postId) {
        bounties[_postId].bountyDeadlineTime += _deadline;
    }

    function acceptHacker(uint _postId,address _address) public onlyCreator(_postId){
        //bounties[_postId].acceptedHackers.push(_address);
        bounties[_postId].acceptedHackers.push(_address);
        emit HackerAccepted(_postId, _address);
    }

    function deleteBounty(uint256 _tokenId, uint _postId) public onlyCreator(_postId){
        histories[_tokenId].openBounties --;
        delete bounties[_postId];
        emit BountyDeleted(postId,msg.sender);
    }

    function isDeadline(uint256 _postId) public view returns(bool deadlineDue){
        if(bounties[_postId].bountyCreationTime == bounties[_postId].bountyDeadlineTime){
            return false;
        }else if(bounties[_postId].bountyDeadlineTime <= block.timestamp) {
            return true;
        }else{
            return false;
        }
    }

    function completeBounty(uint256 _issuerTokenId, uint256 _devTokenId, uint256 _postId) public payable onlyCreator(_postId){
        Bounty storage bounty = bounties[_postId];
        require(msg.value >= bounty.reward, "not enough ether to cover item price and market fee");
        //Bounty storage 
        History storage issuerHistory = histories[_issuerTokenId];
        History storage devHistory = histories[_devTokenId];
        issuerHistory.openBounties --;
        issuerHistory.completedBountiesPayed ++;
        devHistory.completedBountiesEarned ++;

        //payment to the dev
        // bounty.owner.transfer(bounty.reward);

        
        bounty.bountyWinner = bios[_devTokenId].walletAddress;
        (bool sent, bytes memory data) = bounty.bountyWinner.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        issuerHistory.totalRewardsPayed += bounty.reward;
        devHistory.totalRewardsEarned += bounty.reward;

        emit BountyCompleted(_postId, bounty.owner, bounty.creatorProtocol, bounty.bountyWinner);

        delete bounties[_postId];

    }

}