const db = require("../models");
const Document = db.document;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv");
dotenv.config();
const Web3 = require('web3');
const web3 = new Web3(process.env.ETHNETWORK);
const contract = require('@truffle/contract');
const contractJson = require('../../build/contracts/CertificateRegistry.json');
const CertificateRegistry = contract(contractJson);
CertificateRegistry.setProvider(web3.currentProvider);
const path = require('path');
const fs = require('fs');

// Update a Document by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  const account = (await web3.eth.getAccounts())[0];
  let data = await Document.findByPk(id);
  const hash = "0x" + data.hashValue;

  try {
    // Update hash value in the smart contract
    if (req.body.issued == true) {
      CertificateRegistry.deployed().then((instance) => {
        return instance.issueCertificate(hash, { from: account });
      }).then((result) => {
        console.log('Certificate issued:', result);
      }).catch((error) => {
        console.error('Error issuing certificate:', error);
      });

    }
    if (req.body.revoked == true) {
      CertificateRegistry.deployed().then((instance) => {
        return instance.revokeCertificate(hash, { from: account });
      }).then((result) => {
        console.log('Certificate revoked:', result);
      }).catch((error) => {
        console.error('Error revoking certificate:', error);
      });
    }

    // Update Document in the database
    const num = await Document.update(req.body, { where: { id } });
    if (num == 1) {
      res.send({ message: 'Document was updated successfully.' });
    } else {
      res.send({
        message: `Cannot update Document with id=${id}. Maybe Document was not found or req.body is empty!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Error updating Document with id=' + id
    });
  }
};

// Create and Save a new Document
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Get the uploaded file
  const file = req.file;
  const fileName = file.filename;

  let issued = req.body.issued;
  let revoked = req.body.revoked;
  const hash = "0x" + req.body.hashValue;
  const account = (await web3.eth.getAccounts())[0];
  await CertificateRegistry.deployed().then((instance) => {
    return instance.getCertificate(hash, { from: account });
  }).then((result) => {
    issued = true;
    if (result[2] == true)
      revoked = true;
    console.log('Certificate got:', result);
  }).catch((error) => {
    console.error('Error getting certificate:', error);
    issued = false;
  });

  // Create a Document
  const document = {
    title: req.body.title,
    description: req.body.description,
    hashValue: req.body.hashValue,
    issued: issued,
    revoked: revoked,
    sharedEmail: req.body.sharedEmail,
    file: fileName // add the file path to the document object
  };

  // Save Document in the database
  Document.create(document)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Document."
      });
    });
};

exports.checkTitleExists = (req, res) => {
  if (!req.body.title || !req.body.hashValue) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  Document.findOne({ where: { title: req.body.title } })
    .then(data => {
      if (data) {
        Document.findOne({ where: { hashValue: req.body.hashValue } })
          .then(data => {
            if (data) {
              res.send({ TitleExists: true, HashExists: true });
            } else {
              res.send({ TitleExists: true, HashExists: false });
            }
          })
      } else {
        Document.findOne({ where: { hashValue: req.body.hashValue } })
          .then(data => {
            if (data) {
              res.send({ TitleExists: false, HashExists: true });
            } else {
              res.send({ TitleExists: false, HashExists: false });
            }
          })
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving documents."
      });
    });
};


// Retrieve all Documents from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Document.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving documents."
      });
    });
};

// Find a single Document with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Document.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Document with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Document with id=" + id
      });
    });
};

// Delete a Document with the specified id in the request
exports.delete = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../../public/uploads', fileName);

  fs.unlink(filePath, (err) => {
    if (err) throw err
    console.log('User deleted file: ' + fileName);
  });

  Document.destroy({
    where: { file: fileName }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Document was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Document with id=${id}. Maybe Document was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Document with id=" + id
      });
    });
};

// Delete all Documents from the database.
exports.deleteAll = (req, res) => {
  Document.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Documents were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all documents."
      });
    });
};

exports.download = (req, res, next) => {
  const fileName = req.params.fileName
  const filePath = path.join(__dirname, '../../public/uploads', fileName);
  res.download(filePath, fileName);
  console.log('User downloaded file: ' + fileName);
};

// find all issued Document
/*exports.findAllIssued = (req, res) => {
  Document.findAll({ where: { issued: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving documents."
      });
    });
};*/
