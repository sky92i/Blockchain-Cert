export const HomePage = () => {
  return (
    <div className="container">
      <div className="jumbotron">
        <div className="container">
          <h1 className="display-3">Welcome</h1>
          <p>This is a certificate issue and verification platform.  The intention of the platform is to provide an easy
            way for the enterprise or education institution to issue the proof of education, work or examination electronically,
            and verify the genuineness of them electronically.
          </p>
          <p><a className="m-2 btn btn-primary btn-lg" href="verify" role="button">Verify Documents &raquo;</a>
            <a className="m-2 btn btn-primary btn-lg" href="profile" role="button">Login &raquo;</a></p>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h2>For Individuals</h2>
            <p>You can download and view the infomation of your certificates/documents issued from the institutions.</p>
            <p><a className="btn btn-outline-success" href="user-docs" role="button">Login to View Your Documents &raquo;</a></p>
          </div>
          <div className="col-md-4">
            <h2>For Verifiers</h2>
            <p>You can verify the certificates/documents file here. The system will compare the file with what was stored
              on the blockchain.</p>
            <p><a className="btn btn-outline-success" href="verify" role="button">Verify Documents &raquo;</a></p>
          </div>
          <div className="col-md-4">
            <h2>For Institutions</h2>
            <p>You can upload the soft copy of document proof of education, work, or examination to the system as requested by
              the individual applicant. The system will then hash the document file by cryptographic hash function and store
              the hash value on blockchain. You can also share the documents to recipients.</p>
            <p><a className="btn btn-outline-success" href="profile" role="button">Login to Manage Documents &raquo;</a></p>
          </div>
        </div>
        <hr></hr>
      </div>

      <footer class="container">
        <p>Sky Ng 2022-2023</p>
      </footer>
    </div>
  );
};
