import React, { useState } from "react";
import { sha256 } from 'crypto-hash';
import UserService from "../services/user.service";

export const VerifyPage = () => {
  const [hashValue, setHashValue] = useState("");
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  const onChangeFile = (e) => {
    const fr = new FileReader();
    fr.onload = async () => {
      let result = '';
      result = await sha256(fr.result);
      setHashValue(result);
    }
    fr.readAsText(e.target.files[0]);
  }

  const findHash = async () => {
    try {
      const response = await UserService.verifyHash(hashValue);
      setMessage(response.data.message);
      setSuccessful(true);
      console.log(response.data);
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setSuccessful(false);
      setMessage(resMessage);
      console.log(error);
    }
  };

  return (
    <div className="submit-form">
      <div className="form-group">
        <h4>Verify Documents</h4>
        <form>
          <div className="form-group">
            <label htmlFor="file-input">File Input</label>
            <input type="file" className="form-control" id="file-input" onChange={onChangeFile} />
          </div>
        </form>
      </div>

      <div className="form-group">
        <label htmlFor="hash-value">SHA256 Value</label>
        <input
          type="text"
          className="form-control"
          id="hash-value"
          required
          disabled
          value={hashValue}
          name="hash-value"
        />
      </div>

      <div className="form-group">
        <button className="btn btn-success" onClick={findHash}>
          Submit
        </button>
      </div>

      {message && (
        <div className="form-group">
          <div
            className={
              successful
                ? "alert alert-success"
                : "alert alert-danger"
            }
            role="alert"
          >
            {message}
          </div>
        </div>
      )}
    </div>
  );
};
