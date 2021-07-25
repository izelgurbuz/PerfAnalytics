const express = require("express");
const Router = require("./router");
const Controller = require("./controller");

module.exports = function (PORT = 5000) {
  this.serve = function () {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    //CORS
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Allow-Credentials", "true");
      if (req.method == "OPTIONS") {
        res.header("Acces-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
        return res.status(200).json();
      }
      next();
    });
    app.use(express.static("public"));

    const controller = new Controller();
    const router = new Router(controller, app);
    router.initRoutes();

    app.listen(PORT);
  };
};