const { auth, claimCheck, InsufficientScopeError } = require("express-oauth2-jwt-bearer");
const dotenv = require("dotenv");
const db = require("../models");
const Document = db.document;

dotenv.config();

const validateAccessToken = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
});

const checkRequiredPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const permissionCheck = claimCheck((payload) => {
      const permissions = payload.permissions || [];

      const hasPermissions = requiredPermissions.every((requiredPermission) =>
        permissions.includes(requiredPermission)
      );

      if (!hasPermissions) {
        throw new InsufficientScopeError();
      }

      return hasPermissions;
    });

    permissionCheck(req, res, next);
  };
};

const canDownload = (req, res, next) => {
  Document.findAll({ where: { file: req.params.fileName } })
    .then(data => {
      if (data.length === 0) {
        res.status(404).send({
          message: "File not found!"
        });
      }
      else {
        for (let i = 0; i < data.length; i++) {
          if (data[i].sharedEmail === req.auth.payload.email) {
            next();
            return;
          }
        }
        res.status(403).send({
          message: "You are not allowed to download this file!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving documents."
      });
    });
};

module.exports = {
  validateAccessToken,
  checkRequiredPermissions,
  canDownload
};
