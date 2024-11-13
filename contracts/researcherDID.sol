// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title ResearcherDID - A smart contract for decentralized researcher identity management.
contract ResearcherDID {
    
    // Struct to store researcher information
    struct Researcher {
        string name;
        string institution;
        string fieldOfStudy;
        address walletAddress;
        uint256 registrationDate;
        bool isVerified;
    }
    
    // Mapping from unique DID (string) to Researcher struct
    mapping(string => Researcher) private researchers;

    // Events
    event ResearcherRegistered(string indexed did, address indexed walletAddress, string name);
    event ResearcherVerified(string indexed did, bool isVerified);
    event ResearcherUpdated(string indexed did, string name, string institution, string fieldOfStudy);

    // Modifier to ensure only registered researchers can perform certain actions
    modifier onlyRegistered(string memory _did) {
        require(researchers[_did].walletAddress != address(0), "Researcher not registered");
        _;
    }

    // Modifier to ensure only verified researchers can perform certain actions
    modifier onlyVerified(string memory _did) {
        require(researchers[_did].isVerified, "Researcher not verified");
        _;
    }

    /// @notice Register a new researcher with their DID, name, and wallet address.
    /// @param _did The unique decentralized identifier (DID) for the researcher.
    /// @param _name The name of the researcher.
    /// @param _institution The institution or affiliation of the researcher.
    /// @param _fieldOfStudy The field of study for the researcher.
    function registerResearcher(
        string memory _did,
        string memory _name,
        string memory _institution,
        string memory _fieldOfStudy
    ) public {
        require(researchers[_did].walletAddress == address(0), "Researcher already registered");

        // Add the researcher to the mapping
        researchers[_did] = Researcher({
            name: _name,
            institution: _institution,
            fieldOfStudy: _fieldOfStudy,
            walletAddress: msg.sender,
            registrationDate: block.timestamp,
            isVerified: false
        });

        emit ResearcherRegistered(_did, msg.sender, _name);
    }

    /// @notice Verify a researcher (can be restricted to admin-only in a complete implementation).
    /// @param _did The DID of the researcher to verify.
    function verifyResearcher(string memory _did) public onlyRegistered(_did) {
        researchers[_did].isVerified = true;
        emit ResearcherVerified(_did, true);
    }

    /// @notice Update a researcher's profile information.
    /// @param _did The DID of the researcher to update.
    /// @param _name The updated name of the researcher.
    /// @param _institution The updated institution or affiliation.
    /// @param _fieldOfStudy The updated field of study.
    function updateResearcherInfo(
        string memory _did,
        string memory _name,
        string memory _institution,
        string memory _fieldOfStudy
    ) public onlyRegistered(_did) onlyVerified(_did) {
        require(researchers[_did].walletAddress == msg.sender, "Only the researcher can update their info");

        // Update researcher information
        researchers[_did].name = _name;
        researchers[_did].institution = _institution;
        researchers[_did].fieldOfStudy = _fieldOfStudy;

        emit ResearcherUpdated(_did, _name, _institution, _fieldOfStudy);
    }

    /// @notice Retrieve researcher details.
    /// @param _did The DID of the researcher to retrieve.
    /// @return Researcher details including name, institution, fieldOfStudy, walletAddress, registrationDate, and verification status.
    function getResearcher(string memory _did) public view returns (
        string memory name,
        string memory institution,
        string memory fieldOfStudy,
        address walletAddress,
        uint256 registrationDate,
        bool isVerified
    ) {
        require(researchers[_did].walletAddress != address(0), "Researcher not found");

        Researcher memory researcher = researchers[_did];
        return (
            researcher.name,
            researcher.institution,
            researcher.fieldOfStudy,
            researcher.walletAddress,
            researcher.registrationDate,
            researcher.isVerified
        );
    }
}
