// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ResearcherDID {
    function getResearcherWalletAddress(string memory did) external view returns (address);
    function getResearcherVerified(string memory did) external view returns (bool);
}

contract PaperCitationReward {
    struct Paper {
        string authorDID;
        string[] referencePaperList; // list of paperID
    }

    mapping(string => Paper) public papers;

    // count of total registered researcher
    uint256 registeredResearch;
    
    uint256 public constant REGISTRATION_FEE = 0.1 ether;

    ResearcherDID public researcherDID;
    // Cross-Contract Interaction
    constructor(address _researcherDIDAddress){
        researcherDID = ResearcherDID(_researcherDIDAddress);
    }
 
    // Event
    event PaperRegistered(string indexed paperID);
    event RewardDistributed(string indexed paperID, address[] primReceiver, address[] secReceiver);
    event RewardReturn(string indexed papersID);
    
    // modifier
    // check if sufficient fee
    modifier sufficientFee(){
        require(msg.value == REGISTRATION_FEE, "Registration fee is not sufficient.");
        _;
    }
    // check if registrator has been registerd and verified in ResearcherDID
    modifier isResearcherRegisterd(string memory _did){
        require(researcherDID.getResearcherWalletAddress(_did) != address(0), "Researcher not registered");
        require(researcherDID.getResearcherVerified(_did), "Researcher not verified");
        _;
    }


    function registerPaper(
        string memory _authorDID,
        string memory _paperID,
        string[] memory _referencePaperList
    ) public payable sufficientFee() isResearcherRegisterd(_authorDID){
        require(bytes(papers[_paperID].authorDID).length == 0, "Paper already registered");

        // Initialize paper structure
        Paper storage paper = papers[_paperID];
        paper.authorDID = _authorDID;
        paper.referencePaperList = _referencePaperList;

        // construct prim contributor address list
        address[] memory primContributor = new address[](_referencePaperList.length);
        uint256 secCount =0;
        for(uint256 i = 0; i < _referencePaperList.length; i++){
            (string memory authorDID, string[] memory secReferencePaperList) = getPaper(_referencePaperList[i]);
            address wallet = researcherDID.getResearcherWalletAddress(authorDID);
            primContributor[i] = wallet;
            secCount+= secReferencePaperList.length;
        }

        // construct sec contributor address list
        address[] memory secContributor = new address[](secCount);
        for(uint256 i = 0; i < _referencePaperList.length; i++){
            (, string[] memory secReferencePaperList) = getPaper(_referencePaperList[i]);
            for(uint256 j =0; j < secReferencePaperList.length; j++){
                address wallet = researcherDID.getResearcherWalletAddress(getAuthor(secReferencePaperList[j]));
                secContributor[--secCount] = wallet;
            }
        }
        registeredResearch++;
        emit PaperRegistered(_paperID);

        distributeRewards(_paperID,primContributor,secContributor);

    }

    function distributeRewards(
        string memory _paperID,
        address[] memory _primContributor,
        address[] memory _secContributor
    ) internal {
        uint256 primContributorCount = _primContributor.length;
        uint256 secContributorCount = _secContributor.length;

        // if not prim then no charge
        if (primContributorCount == 0) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value}("");
            require(refundSuccess, "Refund to sender failed");

            emit RewardReturn(_paperID);
            return;
        }

        if(secContributorCount == 0){
            // No secondary all goes to prim.
            uint256 reward = REGISTRATION_FEE / primContributorCount;
            for(uint256 i = 0; i < primContributorCount; i++){
                address payable wallet = payable(_primContributor[i]);
                (bool success, ) = wallet.call{value: reward}("");
                require(success, "Primary reward transfer failed");
            }
        }else{
            // 0.7 goes to prim, 0.3 goes to sec.
            uint256 reward = REGISTRATION_FEE * 70 /100 / primContributorCount;

            // prim distribute
            for(uint256 i = 0; i < primContributorCount; i++){
                address payable wallet = payable(_primContributor[i]);
                (bool success, ) = wallet.call{value: reward}("");
                require(success, "Primary reward transfer failed");
            }

            reward = REGISTRATION_FEE * 30 /100 / secContributorCount;
            //sec distribute
            for(uint256 j = 0; j < secContributorCount; j++){
                address payable wallet = payable(_secContributor[j]);
                (bool success, ) = wallet.call{value: reward}("");
                require(success, "Secondary reward transfer failed");
            }
        }

        emit RewardDistributed(_paperID, _primContributor, _secContributor);

    }

    function getPaper(string memory _paperID)
        public
        view
        returns (
            string memory authorDID,
            string[] memory referencePaperList
        )
    {
        Paper memory paper = papers[_paperID];
        return (paper.authorDID, paper.referencePaperList);
    }

    function getAuthor(string memory _paperID)
        public
        view
        returns (
            string memory authorDID
        )
    {
        return (papers[_paperID].authorDID);
    }

    // for contracts to accept Ether transfers without data
    receive() external payable {}
        
}