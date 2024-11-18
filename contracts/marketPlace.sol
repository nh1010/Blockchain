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

    uint public constant REWARD_AMOUNT = 1 ether;

    event CitationAdded(string citedResearcherDID, address citedBy, uint timestamp);
    event RewardDistributed(address to, uint amount);

    modifier preventSelfCitation(string memory _citedResearcherDID) {
        require(msg.sender != researchers[_citedResearcherDID].walletAddress, "Self-citation not allowed");
        _;
    }

    modifier preventMultipleCitations(string memory _citedResearcherDID) {
        Citation[] memory researcherCitations = citations[_citedResearcherDID];
        for (uint i = 0; i < researcherCitations.length; i++) {
            require(researcherCitations[i].citedBy != msg.sender, "Multiple citations from the same address not allowed");
        }
        _;
    }

    modifier checkSufficientBalance() {
        require(address(this).balance >= REWARD_AMOUNT, "Insufficient balance for reward");
        _;
    }

    function registerResearcher(string memory _name, string memory _DID, address _walletAddress) public {
        require(researchers[_DID].walletAddress == address(0), "Researcher already registered");
        researchers[_DID] = Researcher(_name, _DID, _walletAddress, 0);
    }

    function addCitation(string memory _citedResearcherDID)
        public
    {
        // First check if researcher exists
        require(researchers[_citedResearcherDID].walletAddress != address(0), "Researcher not registered");
        
        // Then check for self-citation
        require(msg.sender != researchers[_citedResearcherDID].walletAddress, "Self-citation not allowed");
        
        // Then check for multiple citations
        Citation[] memory researcherCitations = citations[_citedResearcherDID];
        for (uint i = 0; i < researcherCitations.length; i++) {
            require(researcherCitations[i].citedBy != msg.sender, "Multiple citations from the same address not allowed");
        }
        
        // Finally check balance before proceeding with reward
        require(address(this).balance >= REWARD_AMOUNT, "Insufficient balance for reward");

        // Process citation and reward
        citations[_citedResearcherDID].push(Citation(msg.sender, block.timestamp));
        researchers[_citedResearcherDID].citationCount += 1;

        emit CitationAdded(_citedResearcherDID, msg.sender, block.timestamp);

        // Distribute reward to the researcher
        distributeReward(_citedResearcherDID);
    }

    function distributeReward(string memory _researcherDID) internal {
        address payable researcherWallet = payable(researchers[_researcherDID].walletAddress);
        (bool success, ) = researcherWallet.call{value: REWARD_AMOUNT}("");
        require(success, "Reward transfer failed");

        emit RewardDistributed(researcherWallet, REWARD_AMOUNT);
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    receive() external payable {}
}
