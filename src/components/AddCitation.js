import React, { useState } from "react";

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
    <div>
      <h3>Add Citation</h3>
      <input
        type="text"
        placeholder="Cited Researcher DID"
        value={citedDid}
        onChange={(e) => setCitedDid(e.target.value)}
      />
      <button onClick={addCitation}>Add Citation</button>
    </div>
  );
};

export default AddCitation;
