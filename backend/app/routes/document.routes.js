const document = require("../controllers/document.controller");
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { checkRequiredPermissions, validateAccessToken } = require("../middleware/auth.middleware");
const { AdminPermissions } = require("./role-permissions");

// Set the destination and filename for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './public/uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const filename = uuidv4() + '.' + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/doc",
    validateAccessToken, checkRequiredPermissions([AdminPermissions.Read]),
    upload.single('file'),
    document.create
  );

  app.post(
    "/api/doc/title",
    validateAccessToken, checkRequiredPermissions([AdminPermissions.Read]),
    document.checkTitleExists
  );

  app.get(
    "/api/doc",
    validateAccessToken, checkRequiredPermissions([AdminPermissions.Read]),
    document.findAll
  );

  app.get(
    "/api/doc/:id",
    validateAccessToken, checkRequiredPermissions([AdminPermissions.Read]),
    document.findOne
  );

  app.put(
    "/api/doc/:id",
    validateAccessToken, checkRequiredPermissions([AdminPermissions.Read]),
    document.update
  );

  app.delete(
    "/api/doc/:fileName",
    validateAccessToken, checkRequiredPermissions([AdminPermissions.Read]),
    document.delete
  );

  app.get('/api/doc/download/:fileName',
    validateAccessToken, checkRequiredPermissions([AdminPermissions.Read]),
    document.download
  );

  /*app.get(
    "/api/doc/issued",
    validateAccessToken, checkRequiredPermissions([AdminPermissions.Read]),
    document.findAllIssued
  );*/
};
