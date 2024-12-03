import React, { useEffect, useState } from "react";
import Web3 from "web3";
import CitationReward from "./build/contracts/CitationReward.json";
import ResearcherDID from "./build/contracts/ResearcherDID.json";
import RegisterResearcher from "./components/RegisterResearcher";
import AddCitation from "./components/AddCitation";
import WithdrawRewards from "./components/WithdrawRewards";
import ResearcherProfile from "./components/ResearcherProfile";
import TxReceipt from "./components/TxReceipt";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [didContract, setDidContract] = useState(null);
  const [citationContract, setCitationContract] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isBlurred, setIsBlurred] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const networkId = await web3Instance.eth.net.getId();
        const deployedDidNetwork = ResearcherDID.networks[networkId];
        const deployedCitationNetwork = CitationReward.networks[networkId];

        const didInstance = new web3Instance.eth.Contract(
          ResearcherDID.abi,
          deployedDidNetwork && deployedDidNetwork.address
        );

        const citationInstance = new web3Instance.eth.Contract(
          CitationReward.abi,
          deployedCitationNetwork && deployedCitationNetwork.address
        ); 

        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setDidContract(didInstance);
        setCitationContract(citationInstance);
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
    <div>
      <h1>Research Citation DApp</h1>
      {web3 && account ? (
        <>
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
          <RegisterResearcher didContract={didContract} account={account} onTxReceipt={handleReceipt}/>
          <AddCitation citationContract={citationContract} account={account} />
          <WithdrawRewards
            citationContract={citationContract}
            account={account}
          />
          <ResearcherProfile didContract={didContract} onTxReceipt={handleReceipt} />
        </>
      ) : (
        <p>Please connect to MetaMask</p>
      )}
    </div>
  );
};

export default App;
