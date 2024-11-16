import React, { useState } from "react";

const RegisterResearcher = ({ didContract, account }) => {
  const [name, setName] = useState("");
  const [did, setDid] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");

  const register = async () => {
    try {
      await didContract.methods
        .registerResearcher(did, name, institution, fieldOfStudy)
        .send({ from: account });
      alert("Researcher registered successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Register Researcher</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="DID"
        value={did}
        onChange={(e) => setDid(e.target.value)}
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
