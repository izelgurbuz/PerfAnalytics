const mongoose = require("mongoose");
const Website = require("./Website");
const Schema = mongoose.Schema;

const MetricsSchema = mongoose.Schema({
  websiteId: {
    type: Schema.Types.ObjectId,
    ref: "Website",
  },
  TTFB: Number,
  FCP: Number,
  domLoad: Number,
  windowLoad: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Metrics", MetricsSchema);
