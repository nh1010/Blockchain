import React from "react";

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
    <div>
      <h3>Withdraw Rewards</h3>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
};

export default WithdrawRewards;
