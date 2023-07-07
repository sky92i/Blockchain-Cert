import React, { useState, useEffect } from "react";
import DocumentService from "../services/document.service";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export const DocumentsListPage = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const retrieveDocuments = async () => {
      const accessToken = await getAccessTokenSilently();
      await DocumentService.getAll(accessToken)
        .then((response) => {
          setDocuments(response.data);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    retrieveDocuments(user.email);
  }, [user, getAccessTokenSilently]);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const setActiveDocument = (document, index) => {
    setCurrentDocument(document);
    setCurrentIndex(index);
  };

  const downloadFile = async () => {
    const accessToken = await getAccessTokenSilently();
    await DocumentService.downloadFile(currentDocument.file, accessToken)
      .then((response) => {
        //save file to client
        const fileExtension = currentDocument.file.split('.').pop();
        const contentType = getContentType(fileExtension);
        const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", currentDocument.file);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getContentType = (fileExtension) => {
    switch (fileExtension) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
      case 'docx':
        return 'application/msword';
      case 'xls':
      case 'xlsx':
        return 'application/vnd.ms-excel';
      case 'ppt':
      case 'pptx':
        return 'application/vnd.ms-powerpoint';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      default:
        return 'application/octet-stream';
    }
  };

  /*const removeAllDocuments = () => {
    DocumentService.deleteAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };*/

  const searchTitleFunction = async () => {
    const accessToken = await getAccessTokenSilently();
    setCurrentDocument(null);
    setCurrentIndex(-1);

    await DocumentService.findByTitle(searchTitle, accessToken)
      .then((response) => {
        setDocuments(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={searchTitleFunction}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Documents List</h4>

        <ul className="list-group">
          {documents &&
            documents.map((document, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveDocument(document, index)}
                key={index}
              >
                {document.title}
              </li>
            ))}
        </ul>
      </div>
      <div className="card col-md-6">
        {currentDocument ? (
          <div>
            <h4>Information</h4>
            <div>
              <label>
                <strong>Title:</strong>
              </label>{" "}
              {currentDocument.title}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentDocument.description}
            </div>
            <div>
              <label>
                <strong>SHA256 Value:</strong>
              </label>{" "}
              {currentDocument.hashValue}
            </div>
            <div>
              <label>
                <strong>Recipient's Email Address:</strong>
              </label>{" "}
              {currentDocument.sharedEmail}
            </div>
            <div>
              <label>
                <strong>Status:</strong>
              </label>{" "}
              {currentDocument.issued ? "Issued" : "Not issued"}
              <br></br>
              {currentDocument.revoked ? "Revoked" : "Not revoked"}
            </div>
            <br></br>

            <Link
              to={"/docs/" + currentDocument.id}
              className="btn btn-outline-secondary"
            >
              Edit
            </Link>

            <button
              type="submit"
              className="btn btn-success float-right"
              onClick={downloadFile}
            >
              Download
            </button>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a document.</p>
          </div>
        )}
      </div>
    </div>
  );
};
