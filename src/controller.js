const Website = require("./models/Website");
const { uuid } = require("uuidv4");
const Metrics = require("./models/Metrics");
module.exports = function () {
  this.getWebsites = () => Website.find().select("siteId url -_id");
  this.getWebsiteWithId = (siteId, startDate, endDate) => {
    return new Promise((resolve, reject) => {
      if (new Date(startDate) > new Date(endDate))
        reject({
          status: 400,
          message: "Start date cannot be ahead of end date.",
        });
      resolve(
        Website.findOne({
          siteId,
        })
          .populate({
            options: {
              limit: 100,
            },
            path: "analytics",
            match: {
              createdAt: { $gte: startDate, $lte: endDate },
            },
            select: "FCP TTFB domLoad windowLoad createdAt -_id",
          })
          .exec()
      );
    });
  };
  this.addWebsite = (siteUrl) => {
    return new Promise((resolve, reject) => {
      Website.findOne({ url: siteUrl || "" }, function (err, docs) {
        if (err) {
          reject({ status: 500, message: err });
        } else {
          if (!docs) {
            return new Website({
              siteId: uuid(),
              url: siteUrl,
              analytics: [],
            })
              .save()
              .then((created) => {
                //new Metrics({}).save();
                resolve({ status: 200, data: created });
              });
          } else reject({ status: 400, message: "This site already exists!" });
        }
      });
    });
  };

  this.deleteWebsite = (websiteId) => {
    return new Promise((resolve, reject) => {
      if (!websiteId) reject({ status: 400, message: "Empty website id!" });
      Website.findOneAndRemove({ siteId: websiteId }, function (err, res) {
        if (err) {
          reject({ status: 500, message: err });
        } else {
          Metrics.deleteMany({ websiteId: res._id }, function (error, result) {
            if (error) reject({ status: 500, message: error });
            resolve({ status: 200, data: res });
          });
        }
      });
    });
  };
  this.websiteExist = (siteId) =>
    Website.findOne({
      siteId,
    });
  this.collect = (params, exists) => {
    return new Promise((resolve, reject) => {
      const { FCP, TTFB, domLoad, windowLoad } = params || {};
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
          exists
            .save()
            .then((res) => resolve({ status: 200, data: data }))
            .catch((err) => reject({ status: 500, message: err }));
        })
        .catch((err) => {
          reject({ status: 500, message: err });
        });
    });
  };
};
