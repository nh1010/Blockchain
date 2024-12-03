import React, { useState } from "react";
import classes from "./registerResearcher.module.css";

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
    <div className={classes.container}>
      <h3>Register Researcher</h3>
      <input
        type="text"
        className={`form-control ${classes.input}`}
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        className={`form-control ${classes.input}`}
        placeholder="DID"
        value={did}
        onChange={(e) => setDid(e.target.value)}
      />
      <input
        type="text"
        className={`form-control ${classes.input}`}
        placeholder="Institution"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
      />
      <input
        type="text"
        className={`form-control ${classes.input}`}
        placeholder="Field of Study"
        value={fieldOfStudy}
        onChange={(e) => setFieldOfStudy(e.target.value)}
      />
      <button className={`btn btn-primary ${classes.button}`} onClick={register}>Register</button>
    </div>
  );
};

export default RegisterResearcher;
