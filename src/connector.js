const mongoose = require("mongoose");

module.exports = function () {
  this.connect = function () {
    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });
      mongoose.connection.on("error", (error) => {
        reject(error);
      });
      mongoose.connection.once("open", () => {
        console.log("Connected!");
        resolve();
      });
    });
  };
  this.disconnect = function () {
    mongoose.connection.close();
  };
};
