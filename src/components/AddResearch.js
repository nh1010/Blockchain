import React, { useState } from "react";
import classes from "./addCitation.module.css";

const AddResearch = ({ didContract, paperCitationContract, account, weiValue, onTxReceipt}) => {
  const [citedResearchIDs, setCitedResearchIDs] = useState("");
  const [researchID, setResearchID] = useState("");
  const [authorDID, setAuthorDID] = useState("");
  const [searchrRsearchID, setSearchrRsearchID] = useState("");
  const [searchAuthorDID, setSearchAuthorDID] = useState("");
  const [referencePaperList, setReferencePaperList] = useState(null);

  const addResearch = async () => {
    try {
      // split cited ID into array
      setSearchAuthorDID("");
      const citedIdArray = citedResearchIDs.split(",").map((id => id.trim()));

      // check if the register is the author
      const authorWallet = await didContract.methods.getResearcherWalletAddress(authorDID).call();
      if(authorWallet.toLocaleLowerCase() != account.toLocaleLowerCase()){
        alert(`Only the author using the registered wallet address can register research! ${authorWallet}  ${account}`);
        onTxReceipt(null);
        return;
      }

      //@TODO // make sure all the ref exist in system

      const txReceipt = await paperCitationContract.methods
        .registerPaper(authorDID, researchID, citedIdArray)
        .send({ from: account, value: weiValue });

      txReceipt.msg = `Research registered successfully, research ID is ${researchID}!`;
      onTxReceipt(txReceipt);

    } catch (error) {
      console.error(error);
    }
  };

  const searchResearch = async () => {
    try{
        if(researchID == ""){
            alert("Please enter a Research Identifier to search for a research.")
            searchAuthorDID = "";
            onTxReceipt(null);
            return
        }

        const details = await paperCitationContract.methods.getPaper(researchID).call();
        setSearchrRsearchID(researchID);
        setSearchAuthorDID(details[0]);
        setReferencePaperList(details[1]);

        if(details[0] == ""){
            onTxReceipt(false);
            alert("No research under this researchID.");
            return
        }

        const receipt = {
            msg : `Successfully fetched reserch with researchID : ${researchID}!`,
            transactionHash : null,
        };
        onTxReceipt(receipt);

    } catch (error) {
        console.error(error);
    }
  }

  return (
    <div className={classes.container}>
      <h3>Add Research</h3>
      <input
        type="text"
        className={`form-control ${classes.input}`}
        placeholder="Research Identifier*"
        value={researchID}
        onChange={(e) => setResearchID(e.target.value)}
      />
      <input
        type="text"
        className={`form-control ${classes.input}`}
        placeholder="Authors DID"
        value={authorDID}
        onChange={(e) => setAuthorDID(e.target.value)}
      />
      <input
        type="text"
        className={`form-control ${classes.input}`}
        placeholder="Cited Research ID"
        value={citedResearchIDs}
        onChange={(e) => setCitedResearchIDs(e.target.value)}
      />
      <div className={classes["button-container"]}>
        <button className="btn btn-primary" onClick={addResearch}>Add</button>
        <button className="btn btn-primary" onClick={searchResearch}>Search</button>
      </div>
      {
        searchAuthorDID != "" && (
            <div className={classes["styled-container"]}>
                <h4 className={classes["detail-header"]}>Research Details</h4>
                <p><strong>Research ID:</strong> {searchrRsearchID}</p>
                <p><strong>Author DID:</strong> {searchAuthorDID}</p>
                <p><strong>Ref Research IDs:</strong> {referencePaperList}</p>
              </div>
        )
      }
    </div>
  );
};

export default AddResearch;
