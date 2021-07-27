const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Website = require("./models/Website");
const { uuid } = require("uuidv4");
const Metrics = require("./models/Metrics");

module.exports = function (controller, app) {
  this.initRoutes = () => {
    app.get("/dashboard/websites", async (req, res) => {
      try {
        const websites = await controller.getWebsites();
        res.json(websites?.reverse());
      } catch (error) {
        res.json({ message: error });
      }
    });
    app.post("/dashboard/website/:siteId", async (req, res) => {
      const websiteId = req.params.siteId;
      controller
        .deleteWebsite(websiteId)
        .then(({ status, data }) => {
          res.status(status);
          res.json(data);
        })
        .catch(({ status, message }) => {
          res.status(status);
          res.json(message);
        });
    });

    app.get("/dashboard/website/:siteId", async (req, res) => {
      try {
        const startDate =
            req.query.startDate || new Date(Date.now() - 30 * 60 * 1000),
          endDate = req.query.endDate || Date.now();
        const website = await controller.getWebsiteWithId(
          req.params.siteId,
          startDate,
          endDate
        );
        if (!website) {
          res.status(404).json({ message: "No website Found" });
        } else if (website.message) {
          res.status(website.status).json({ message: website.message });
        } else {
          res.json(website);
        }
      } catch (error) {
        res.json({ message: error });
      }
    });

    app.post("/dashboard/addWebsite", async (req, res) => {
      const siteUrl = req.body?.url;
      if (!siteUrl) {
        res.status(400);
        res.json({ message: "No Url!" });
      }
      controller
        .addWebsite(siteUrl)
        .then(({ status, data }) => {
          res.status(status);
          res.json(data);
        })
        .catch(({ status, message }) => {
          res.status(status);
          res.json(message);
        });
    });

    app.post("/analytics/collect", async (req, res) => {
      console.log("Got body:", req.body);
      const exists = await controller.websiteExist(req.body?.siteID);
      if (!exists) res.status(404).json({ message: "Incorrect site id" });
      else {
        controller
          .collect(req.body || {}, exists)
          .then(({ status, data }) => {
            res.status(status);
            res.json(data);
          })
          .catch(({ status, message }) => {
            console.log(status, message);
            res.status(status);
            res.json(message);
          });
      }
    });

    // error handling
    //Error Handling
    app.use((req, res, next) => {
      var err = new Error("Not Found");
      err.status = 404;
      next(err);
    });

    app.use((error, req, res, next) => {
      res.status(error.status || 500);
      res.json({
        message: error.message,
      });
    });
  };
};
