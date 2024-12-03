import React, { useState } from "react";
import classes from "./researcherProfile.module.css";

const ResearcherProfile = ({ didContract }) => {
  const [did, setDid] = useState("");
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const details = await didContract.methods.getResearcher(did).call();
      setProfile(details);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <h3>Researcher Profile</h3>
      <input
        type="text"
        className={`form-control ${classes.input}`}
        placeholder="Researcher DID"
        value={did}
        onChange={(e) => setDid(e.target.value)}
      />
      <button className={`btn btn-primary ${classes.button}`} onClick={fetchProfile}>Fetch Profile</button>
      {profile && (
        <div>
          <p>Name: {profile[0]}</p>
          <p>Institution: {profile[1]}</p>
          <p>Field of Study: {profile[2]}</p>
          <p>Wallet Address: {profile[3]}</p>
          <p>
            Registration Date: {new Date(profile[4] * 1000).toLocaleString()}
          </p>
          <p>Verified: {profile[5] ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};

export default ResearcherProfile;
