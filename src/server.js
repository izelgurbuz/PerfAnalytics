const express = require("express");
const Router = require("./router");
const Controller = require("./controller");
const path = require('path');

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
      res.header("Acces-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
      res.header('Access-Control-Allow-Headers: X-Requested-With');

      if (req.method == "OPTIONS") {
        
        return res.status(200).json();
      }
      next();
    });
    app.use(express.static("public"));
    app.use(express.static("dashboard/build"));
    ['/perfAnalytics' ,'/perfAnalytics/*'].forEach(p => {
      app.get(p, (req, res) => {
          res.sendFile(path.resolve('./dashboard', 'build', 'index.html'));
      });
  });


    const controller = new Controller();
    const router = new Router(controller, app);
    router.initRoutes();

   
    app.listen(process.env.port || PORT);
  };
};
