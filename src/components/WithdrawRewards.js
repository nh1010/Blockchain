import React from "react";
import classes from "./withdrawRewards.module.css";

const WithdrawRewards = ({ citationContract, account }) => {
  const withdraw = async () => {
    try {
      await citationContract.methods.withdrawRewards().send({ from: account });
      alert("Rewards withdrawn successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={classes.container}>
      <h3>Withdraw Rewards</h3>
      <button className={`btn btn-primary ${classes.button}`} onClick={withdraw}>Withdraw</button>
    </div>
  );
};

export default WithdrawRewards;
