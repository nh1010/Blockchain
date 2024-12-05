import React, { useEffect, useState } from "react";
import './styles.css';  // Add this import
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
    <div className="d-flex flex-column min-vh-100 blockchain-theme">
      <nav className="navbar navbar-expand-lg custom-nav">
        <div className="container">
          <a className="navbar-brand" href="#">
            <i className="fas fa-link me-2"></i>
            Research Citation DApp
          </a>
        </div>
      </nav>

      <div className="container py-4">
        <div className="glass-card mb-4">
          {web3 && account ? (
            <div className="text-center p-4">
              <div className="hex-pattern"></div>
              <h4 className="text-gradient mb-3">Wallet Connection Status</h4>
              <p className="mb-3">
                <strong>Connected Address: </strong>
                <span className={`wallet-address ${isBlurred ? 'blurred' : ''}`}>
                  {account}
                </span>
                <button 
                  className="btn btn-outline-neon ms-2"
                  onClick={toggleBlur}
                >
                  {isBlurred ? "Show" : "Hide"}
                </button>
              </p>
              <TxReceipt receipt={receipt}/>
            </div>
          ) : (
            <div className="text-center p-4">
              <div className="metamask-prompt">
                <i className="fas fa-wallet mb-3"></i>
                <p>Please connect to MetaMask to continue</p>
              </div>
            </div>
          )}
        </div>

        {web3 && account && (
          <div className="row g-4">
            <div className="col-md-4">
              <div className="glass-card component-card">
                <RegisterResearcher 
                  didContract={didContract} 
                  account={account} 
                  onTxReceipt={handleReceipt}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card component-card">
                <AddResearch 
                  didContract={didContract}
                  paperCitationContract={paperCitationContract}
                  account={account}
                  weiValue={weiValue}
                  onTxReceipt={handleReceipt}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card component-card">
                <ResearcherProfile 
                  didContract={didContract}
                  senderAccount={account}
                  onTxReceipt={handleReceipt}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
