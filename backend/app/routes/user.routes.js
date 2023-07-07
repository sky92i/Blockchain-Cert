const user = require("../controllers/user.controller");
const { validateAccessToken, canDownload } = require("../middleware/auth.middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //app.get("/api/usr/all", user.allAccess);

  app.post("/api/usr/verifyhash", user.checkHashExisted);

  app.post("/api/usr", validateAccessToken, user.findAll);

  app.get('/api/usr/download/:fileName', validateAccessToken, canDownload, user.download)

};
