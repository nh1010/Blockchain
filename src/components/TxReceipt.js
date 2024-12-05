import React from "react";

const TxReceipt = ({receipt}) => {
    if (!receipt) return null;
    const currentTime = new Date().toLocaleString();
    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
          <h4>============= Transaction Message =============</h4>
          <p style={{fontStyle: "italic", fontWeight: "bold" , color: "darkblue"  }}> " {receipt.msg} "</p>
          <p>Message time: {currentTime}</p>
        {receipt.transactionHash && (
          <>
          <h4>============= Transaction Receipt =============</h4>
          <p><strong>Transaction Hash:</strong> {receipt.transactionHash}</p>
          {/* <p><strong>Block Number:</strong> {receipt.blockNumber.toLocaleString()}</p> */}
          <p><strong>Gas Used:</strong> {receipt.cumulativeGasUsed.toLocaleString()}</p>
          <p><strong>Gas Paid Address:</strong> {receipt.from}</p>
          <p><strong>Contract Address:</strong> {receipt.logs[0].address || "N/A"}</p>
          <p>
          <strong>Status:</strong>{" "}
            <span
              style={{
                color: receipt.status ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {receipt.status ? "Success" : "Failed"}
            </span>
          </p>
          </>
        )}
        </div>
    );
};

export default TxReceipt;