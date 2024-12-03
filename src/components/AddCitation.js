import React, { useState } from "react";
import classes from "./addCitation.module.css";

const AddCitation = ({ citationContract, account }) => {
  const [citedDid, setCitedDid] = useState("");

  const addCitation = async () => {
    try {
      await citationContract.methods
        .addCitation(citedDid)
        .send({ from: account });
      alert("Citation added successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <h3>Add Citation</h3>
      <input
        type="text"
        className={`form-control ${classes.input}`}
        placeholder="Cited Researcher DID"
        value={citedDid}
        onChange={(e) => setCitedDid(e.target.value)}
      />
      <button className="btn btn-primary" onClick={addCitation}>Add Citation</button>
    </div>
  );
};

export default AddCitation;
