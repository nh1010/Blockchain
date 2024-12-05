import React, { useEffect, useState } from "react";
import Web3 from "web3";
import ResearcherDID from "./build/contracts/ResearcherDID.json";
import RegisterResearcher from "./components/RegisterResearcher";
import PaperCitationReward from "./build/contracts/PaperCitationReward.json";
import ResearcherProfile from "./components/ResearcherProfile";
import TxReceipt from "./components/TxReceipt";
import AddResearch from "./components/AddResearch";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [didContract, setDidContract] = useState(null);
  const [paperCitationContract, setPaperCitationContract] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isBlurred, setIsBlurred] = useState(true);
  const [weiValue, setWeiValue] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const networkId = await web3Instance.eth.net.getId();
        const deployedDidNetwork = ResearcherDID.networks[networkId];
        const deployedPaperCitationRewardNetwork = PaperCitationReward.networks[networkId];

        const didInstance = new web3Instance.eth.Contract(
          ResearcherDID.abi,
          deployedDidNetwork && deployedDidNetwork.address
        ); 

        const paperCitationInstance = new web3Instance.eth.Contract(
          PaperCitationReward.abi,
          deployedPaperCitationRewardNetwork && deployedPaperCitationRewardNetwork.address
        ); 

        if (!deployedDidNetwork || !deployedPaperCitationRewardNetwork) {
          console.error("Contracts are not deployed on the current network.");
          return;
        }

        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setDidContract(didInstance);
        setPaperCitationContract(paperCitationInstance);
        // Set weiValue after web3 instance is initialized
        setWeiValue(web3Instance.utils.toWei("0.1", "ether"));

      }
    };
    init();
  }, []);

  const handleReceipt = (txReceipt) => {
    setReceipt(txReceipt);
  };

  const toggleBlur = () => {
    setIsBlurred((prev) => !prev);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#">
          Research Citation DApp
        </a>
      </nav>

      {/* Main Content Container */}
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        {/* Top Section */}
        <div 
          className="d-flex text-center"
          style={{
            position: "sticky",
            backgroundColor: "white",
            zIndex: 1000,
            top: 0,
          }}
        >
        {web3 && account ? (
          <div className="text-center">
              <p>
              <strong>Connected Wallet Address: </strong>{" "}
              <span
                style={{
                  filter: isBlurred ? "blur(8px)" : "none",
                  transition: "filter 0.3s ease",
                  userSelect: "none",
                }}
              >
                {account}
              </span>
              <button onClick={toggleBlur} style={{ marginLeft: "10px" }}>
                {isBlurred ? "Show" : "Hide"}
              </button>
            </p>
            <TxReceipt receipt={receipt}/>
          </div>
          ) : (
          <p style={{color : "red", fontWeight : "bold"}}> Please connect to MetaMask </p>
        )}
        </div>
      <hr />

      {/* Bottom Section */}
      
      {web3 && account ? ( 
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <RegisterResearcher didContract={didContract} account={account} onTxReceipt={handleReceipt}/>
          <hr />
          <AddResearch didContract={didContract} paperCitationContract={paperCitationContract} account={account} weiValue={weiValue} onTxReceipt={handleReceipt}/>
          <hr />
          <ResearcherProfile didContract={didContract} senderAccount = {account}onTxReceipt={handleReceipt}/>
        </div>
        ):(<p></p>)
      }
      </div>
  </div>
  );
};

export default App;
