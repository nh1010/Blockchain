// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CitationReward {
    struct Researcher {
        string name;
        string DID;
        address walletAddress;
        uint citationCount;
    }

    struct Citation {
        address citedBy;
        uint timestamp;
    }

    mapping(string => Researcher) public researchers;
    mapping(string => Citation[]) public citations;

    event CitationAdded(string citedResearcherDID, address citedBy, uint timestamp);
    event RewardDistributed(address to, uint amount);

    uint constant REWARD_AMOUNT = 1 ether;

    function registerResearcher(string memory _name, string memory _DID, address _walletAddress) public {
        require(researchers[_DID].walletAddress == address(0), "Researcher already registered");
        researchers[_DID] = Researcher(_name, _DID, _walletAddress, 0);
    }

    modifier preventManipulation(string memory _citedResearcherDID) {
        require(msg.sender != researchers[_citedResearcherDID].walletAddress, "Self-citation is not allowed");
        Citation[] memory citationsForResearcher = citations[_citedResearcherDID];
        for (uint i = 0; i < citationsForResearcher.length; i++) {
            require(citationsForResearcher[i].citedBy != msg.sender, "Multiple citations from the same address not allowed");
        }
        _;
    }

    function addCitation(string memory _citedResearcherDID) public preventManipulation(_citedResearcherDID) {
        require(researchers[_citedResearcherDID].walletAddress != address(0), "Researcher not registered");

        citations[_citedResearcherDID].push(Citation(msg.sender, block.timestamp));
        researchers[_citedResearcherDID].citationCount += 1;

        emit CitationAdded(_citedResearcherDID, msg.sender, block.timestamp);

        distributeReward(_citedResearcherDID);
    }

    function distributeReward(string memory _researcherDID) internal {
        address payable researcherWallet = payable(researchers[_researcherDID].walletAddress);
        require(address(this).balance >= REWARD_AMOUNT, "Insufficient balance for reward");

        (bool success, ) = researcherWallet.call{value: REWARD_AMOUNT}("");
        require(success, "Reward transfer failed");

        emit RewardDistributed(researcherWallet, REWARD_AMOUNT);
    }

    // This function returns the contract's balance
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    receive() external payable {}  // Fallback to accept funding for rewards
}
