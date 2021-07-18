const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Website = require("./models/Website");
const { uuid } = require("uuidv4");
const Metrics = require("./models/Metrics");

router.get("/dashboard/websites", async (req, res) => {
  try {
    const websites = await Website.find().select("siteId url -_id");
    res.json(websites);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/dashboard/website/:siteId", async (req, res) => {
  try {
    const startDate =
        req.query.startDate || new Date(Date.now() - 30 * 60 * 10000),
      endDate = req.query.endDate || Date.now();
    const website = await Website.findOne({
      siteId: req.params.siteId,
    })
      .populate({
        path: "analytics",
        match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      })
      .exec();
    if (!website) {
      res.status(404).json({ message: "No website Found" });
    } else {
      res.json(website);
    }
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/dashboard/addWebsite", async (req, res) => {
  try {
    const siteUrl = req.body?.url;
    if (!siteUrl) {
      res.status(400);
      res.json({ message: "No Url!" });
    }
    Website.findOne({ url: siteUrl || "" }, function (err, docs) {
      if (err) {
        res.status(500);
        res.json({ error });
      } else {
        if (!docs) {
          return new Website({
            siteId: uuid(),
            url: siteUrl,
            analytics: [],
          })
            .save()
            .then((created) => {
              new Metrics({}).save();
              res.status(200);
              res.json(created);
            });
        }
        res.status(400);
        res.json({ message: "This site already exists!" });
      }
    }).catch((error) => {
      res.status(500);
      res.json({ error });
    });
  } catch (error) {
    res.status(500);
    res.json({ error });
  }
});

router.post("/analytics/collect", async (req, res) => {
  try {
    console.log("Got body:", req.body);

    const exists = await Website.findOne({
      siteId: req.body?.siteID,
    });
    if (!exists) res.status(404).json({ message: "Incorrect site id" });
    else {
      const { FCP, TTFB, domLoad, windowLoad } = req.body || {};
      const metric = new Metrics({
        websiteId: exists._id,
        FCP,
        TTFB,
        domLoad,
        windowLoad,
      });
      metric
        .save()
        .then((data) => {
          exists.analytics.push(metric);
          exists.save();
          res.status(200);
          res.json(data);
        })
        .catch((err) => {
          res.status(500);
          res.json(err);
        });
    }
    // const website = new Website({ url: "www.lalala.cm", siteId: "000" });
    // website.save(function (err, fluffy) {
    //   if (err) return console.error(err);
    //   console.log("Saved!");
    // });
    // res.sendStatus(200);

    // console.log("Success");
    //

    //res.json({ message: "success" });
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
