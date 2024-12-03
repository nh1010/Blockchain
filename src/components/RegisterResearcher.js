import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { parseErrorMessage } from "./helper";

const RegisterResearcher = ({ didContract, account, onTxReceipt }) => {
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");

  const register = async () => {
    try {
      // Generate a random DID
      const randomDid = `${uuidv4()}`;

      const txReceipt = await didContract.methods
        .registerResearcher(randomDid, name, institution, fieldOfStudy)
        .send({ from: account });
      txReceipt.msg = `Researcher registered successfully, your DID is ${randomDid}!`;

      // alert(`Researcher registered successfully, your DID is ${randomDid}!`);

      onTxReceipt(txReceipt);

    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div>
      <h3>Register Researchers</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Institution"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
      />
      <input
        type="text"
        placeholder="Field of Study"
        value={fieldOfStudy}
        onChange={(e) => setFieldOfStudy(e.target.value)}
      />
      <button onClick={register}>Register</button>
    </div>
  );
};

export default RegisterResearcher;
