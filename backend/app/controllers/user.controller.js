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

/*exports.allAccess = (req, res) => {
  res.status(200).send("Welcome");
};*/

exports.checkHashExisted = (req, res, next) => {
  const hash = "0x" + req.body.hashvalue;
  const account = (web3.eth.getAccounts())[0];

  Document.findOne({
    where: {
      hashValue: req.body.hashvalue
    }
  }).then(user => {
    if (user) {
      CertificateRegistry.deployed().then((instance) => {
        return instance.getCertificate(hash, { from: account });
      }).then((result) => {
        if (result[2] == false)
          res.status(200).send({
            message: "Certificate valid. The certificate records in our database and on the blockchain are both valid."
          });
        if (result[2] == true)
          res.status(404).send({
            message: "Certificate revoked. The certificate records in our database and on the blockchain are both revoked."
          });
        console.log('Certificate data:', result);
      }).catch((error) => {
        res.status(404).send({
          message: "Certificate invalid. The certificate record does not exist on the blockchain."
        });
        console.error('Error getting certificate on blockchain:', error);
      });
      return;
    }

    else {
      CertificateRegistry.deployed().then((instance) => {
        return instance.getCertificate(hash, { from: account });
      }).then((result) => {
        if (result[2] == false)
          res.status(200).send({
            message: "Certificate valid. The certificate is not recorded in our database, but there is a valid record on the blockchain."
          });
        if (result[2] == true)
          res.status(404).send({
            message: "Certificate revoked. The certificate is not recorded in our database, but there is a revoked record on the blockchain."
          });
        console.log('Certificate data:', result);
      }).catch((error) => {
        res.status(404).send({
          message: "Certificate invalid. The certificate records do not exist on our database and blockchain."
        });
        console.error('Error getting certificate on blockchain:', error);
      });
      return;
    }
  });
};

// Retrieve user Documents from the database, where user email matches the sharedEmail field.
exports.findAll = (req, res) => {
  const title = req.body.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` }, sharedEmail: req.body.email } : null;
  console.log(condition);

  Document.findAll({ where: condition })
    .then(data => {
      if (condition == null) {
        Document.findAll({ where: { sharedEmail: req.body.email } })
          .then(data => {
            res.send(data);
          })
      }
      else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving documents."
      });
    }
    );
};

exports.download = (req, res, next) => {
  const fileName = req.params.fileName
  const filePath = path.join(__dirname, '../../public/uploads', fileName);
  res.download(filePath, fileName);
  console.log('User downloaded file: ' + fileName);
}
