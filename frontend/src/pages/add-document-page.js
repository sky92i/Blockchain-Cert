import React, { useState } from "react";
import DocumentService from "../services/document.service";
import { sha256 } from 'crypto-hash';
import { useAuth0 } from "@auth0/auth0-react";

export const AddDocumentPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [hashValue, setHashValue] = useState("");
  const [issued, setIssued] = useState(false);
  const [revoked, setRevoked] = useState(false);
  const [sharedEmail, setSharedEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  }

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  }

  const onChangeSharedEmail = (e) => {
    setSharedEmail(e.target.value);
  }

  const onChangeFile = (e) => {
    const file = e.target.files[0];
    const fr = new FileReader();
    fr.onload = async () => {
      let result = '';
      result = await sha256(fr.result);
      setFile(file);
      setHashValue(result);
    }
    fr.readAsText(file);
  }

  const saveDocument = async () => {
    const accessToken = await getAccessTokenSilently();
    const checkData = {
      title: title,
      hashValue: hashValue
    };

    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('file', file);
    data.append('hashValue', hashValue);
    data.append('issued', issued);
    data.append('revoked', revoked);
    data.append('sharedEmail', sharedEmail);

    DocumentService.checkTitleExists(checkData, accessToken)
      .then(response => {
        if (response.data.TitleExists) {
          alert('Title already exists in database!');
        } else if (response.data.HashExists) {
          alert('Hash value already exists in database!');
        } else {
          DocumentService.create(data, accessToken)
            .then(response => {
              setTitle(response.data.title);
              setDescription(response.data.description);
              setFile(response.data.file);
              setHashValue(response.data.hashValue);
              setIssued(response.data.issued);
              setRevoked(response.data.revoked);
              setSharedEmail(response.data.sharedEmail);
              setSubmitted(true);
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  const newDocument = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setHashValue("");
    setIssued(false);
    setRevoked(false);
    setSharedEmail("");
    setSubmitted(false);
  }

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>Submitted successfully!</h4>
          <div className="alert alert-success mt-3">
            Your file has been uploaded.
          </div>
          <button className="btn btn-success" onClick={newDocument}>
            Add Another File
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <h4>Add Documents</h4>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              required
              value={title}
              onChange={onChangeTitle}
              name="title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <input
              type="text"
              className="form-control"
              id="description"
              required
              value={description}
              onChange={onChangeDescription}
              name="description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="file-input">File Input</label>
            <input
              type="file"
              className="form-control"
              id="file-input"
              onChange={onChangeFile}
            />
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
            <label htmlFor="shared-email">Recipient's Email Address (You can fill in later)</label>
            <input
              type="text"
              className="form-control"
              id="shared-email"
              value={sharedEmail}
              onChange={onChangeSharedEmail}
              name="shared-email"
            />
          </div>

          <button onClick={saveDocument} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};
