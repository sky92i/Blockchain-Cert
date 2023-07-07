import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import DocumentService from "../services/document.service";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, useNavigate } from 'react-router-dom';

export const DocumentPage = () => {
  const [currentDocument, setCurrentDocument] = useState({
    id: null,
    title: "",
    description: "",
    hashValue: "",
    issued: false,
    revoked: false,
    sharedEmail: "",
  });
  const [message, setMessage] = useState("");
  const [showIssueConfirmation, setShowIssueConfirmation] = useState(false);
  const [showRevokeConfirmation, setShowRevokeConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { getAccessTokenSilently } = useAuth0();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getDocument = async (id) => {
      const accessToken = await getAccessTokenSilently();
      await DocumentService.get(id, accessToken)
        .then((response) => {
          setCurrentDocument(response.data);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getDocument(id);
  }, [id, getAccessTokenSilently]);

  const onChangeTitle = (e) => {
    const title = e.target.value;

    setCurrentDocument((prevState) => ({
      ...prevState,
      title: title,
    }));
  };

  const onChangeDescription = (e) => {
    const description = e.target.value;

    setCurrentDocument((prevState) => ({
      ...prevState,
      description: description,
    }));
  };

  const onChangeSharedEmail = (e) => {
    const sharedEmail = e.target.value;

    setCurrentDocument((prevState) => ({
      ...prevState,
      sharedEmail: sharedEmail,
    }));
  };

  const updateIssued = (status) => {
    if (status) {
      setShowIssueConfirmation(true);
    } else {
      updateDocument(status);
    }
  };

  const updateRevoked = (status) => {
    if (status) {
      setShowRevokeConfirmation(true);
    } else {
      updateDocument(status);
    }
  };

  const confirmUpdateIssued = async (status) => {
    const accessToken = await getAccessTokenSilently();
    var data = {
      id: currentDocument.id,
      issued: status,
    };
    await DocumentService.update(currentDocument.id, data, accessToken)
      .then((response) => {
        setCurrentDocument((prevState) => ({
          ...prevState,
          issued: status
        }));
        setShowIssueConfirmation(false); // close the confirmation popup
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const confirmUpdateRevoked = async (status) => {
    const accessToken = await getAccessTokenSilently();
    var data = {
      id: currentDocument.id,
      revoked: status,
    };
    await DocumentService.update(currentDocument.id, data, accessToken)
      .then((response) => {
        setCurrentDocument((prevState) => ({
          ...prevState,
          revoked: status
        }));
        setShowRevokeConfirmation(false); // close the confirmation popup
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateDocument = async () => {
    const accessToken = await getAccessTokenSilently();
    await DocumentService.update(currentDocument.id, currentDocument, accessToken)
      .then((response) => {
        console.log(response.data);
        setMessage("The document was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteDocument = (status) => {
    if (status) {
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDeleteDocument = async () => {
    const accessToken = await getAccessTokenSilently();
    await DocumentService.delete(currentDocument.file, accessToken)
      .then((response) => {
        console.log(response.data);
        navigate('/docs');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentDocument ? (
        <div className="edit-form">
          <h4>Document</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={currentDocument.title}
                onChange={onChangeTitle}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <input
                type="text"
                className="form-control"
                id="description"
                value={currentDocument.description}
                onChange={onChangeDescription}
              />
            </div>
            <div className="form-group">
              <label htmlFor="hash-value">SHA256 Value</label>
              <input
                type="text"
                className="form-control"
                id="hash-value"
                disabled
                value={currentDocument.hashValue}
              />
            </div>
            <div className="form-group">
              <label htmlFor="shared-email">Recipient's Email Address</label>
              <input
                type="text"
                className="form-control"
                id="shared-email"
                value={currentDocument.sharedEmail}
                onChange={onChangeSharedEmail}
              />
            </div>
            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentDocument.issued ? "Issued" : "Not issued"}
              <br></br>
              {currentDocument.revoked ? "Revoked" : "Not revoked"}
            </div>
          </form>

          {currentDocument.issued ? (
            <button className="m-2 btn btn-primary" disabled>
              Issue (Write Hash Value to Blockchain)
            </button>
          ) : (
            <button
              className="m-2 btn btn-primary"
              onClick={() => updateIssued(true)}
            >
              Issue (Write Hash Value to Blockchain)
            </button>
          )}

          <Modal
            show={showIssueConfirmation}
            onHide={() => setShowIssueConfirmation(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to issue this document? This action cannot be undone. <b>The record will live forever on the blockchain.</b></Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowIssueConfirmation(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={() => confirmUpdateIssued(true)}>
                Issue
              </Button>
            </Modal.Footer>
          </Modal>

          {currentDocument.revoked || !currentDocument.issued ? (
            <button className="m-2 btn btn-danger" disabled>
              Revoke (Mark as Revoked in Blockchain)
            </button>
          ) : (
            <button
              className="m-2 btn btn-danger"
              onClick={() => updateRevoked(true)}
            >
              Revoke (Mark as Revoked in Blockchain)
            </button>
          )}

          <Modal
            show={showRevokeConfirmation}
            onHide={() => setShowRevokeConfirmation(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to revoke this document? This action cannot be undone. <b>The record will live forever on the blockchain.</b></Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowRevokeConfirmation(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={() => confirmUpdateRevoked(true)}>
                Revoke
              </Button>
            </Modal.Footer>
          </Modal>

          <button
            type="submit"
            className="m-2 btn btn-success"
            onClick={updateDocument}
          >
            Update Document Information
          </button>

          {currentDocument.issued ? (
            <button className="m-2 btn btn-danger" disabled>
              Delete Document from Database and Storage
            </button>
          ) : (
            <button
              className="m-2 btn btn-danger"
              onClick={() => deleteDocument(true)}
            >
              Delete Document from Database and Storage
            </button>
          )}

          <Modal
            show={showDeleteConfirmation}
            onHide={() => setShowDeleteConfirmation(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this document?</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={() => confirmDeleteDocument(true)}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Document...</p>
        </div>
      )}
    </div>
  );
};
