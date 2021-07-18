const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WebsiteSchema = mongoose.Schema({
  url: String,
  siteId: String,
  analytics: [
    {
      type: Schema.Types.ObjectId,
      ref: "Metrics",
    },
  ],
});

module.exports = mongoose.model("Website", WebsiteSchema);
