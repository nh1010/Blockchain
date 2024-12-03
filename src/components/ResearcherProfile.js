import React, { useState } from "react";
import { parseErrorMessage } from "./helper";

const ResearcherProfile = ({ didContract, onTxReceipt }) => {
  const [did, setDid] = useState("");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [account, setAccount] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [verified, setVerified] = useState(null);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const details = await didContract.methods.getResearcher(did).call();
      setName(details[0]);
      setInstitution(details[1]);
      setFieldOfStudy(details[2]);
      setAccount(details[3]);
      setRegistrationDate(details[4]);
      setVerified(details[5]);
      setProfile(details);

      const receipt = {
        msg : `Successfully fetched resercher with DID : ${did}!`,
        transactionHash : null,
      };

      onTxReceipt(receipt);

    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      alert(`Error: ${errorMessage}`);
    }
  };

  const updateProfile = async () => {
    try{
      const receipt = await didContract.methods
      .updateResearcherInfo(did, name, institution, fieldOfStudy)
      .send({ from: account });
      receipt.msg = `Researcher info is successfully updated with DID : ${did}!`;

      const updateProfile = [name, institution, fieldOfStudy];
      setProfile(updateProfile);

      onTxReceipt(receipt);

    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      alert(`Error: ${errorMessage}`);
    }
  }

  // check if user has modified the info
  const isModified = profile
    ? profile[0] != name || profile[1] != institution || profile[2] != fieldOfStudy
    : false

  return (
    <div>
      <h3>Researcher Profile</h3>
      <input
        type="text"
        placeholder="Researcher DID"
        value={did}
        onChange={(e) => setDid(e.target.value)}
      />
      <button onClick={fetchProfile}>Fetch Profile</button>
      {account && (
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <br />
          <label>
            Institution:
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </label>
          <br />
          <label>
            Field of Study:
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
            />
          </label>
          <br />
          <p>
            Wallet Address: {account}
          </p>
          <p>
            Registration Date: {new Date(Number(registrationDate) * 1000).toLocaleString()}
          </p>
          <p>Verified: {verified ? "Yes" : "No"}</p>
          <button onClick={updateProfile} disabled = {!verified || !isModified}>
            Update Profile
          </button>
          {!verified && (
            <p style={{ color: "red", marginTop: "10px" }}>
              Only verified accounts can update their information.
            </p>
          )}
          {verified && !isModified && (
            <p style={{ color: "red", marginTop: "10px" }}>
              No changes made to the profile.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResearcherProfile;
