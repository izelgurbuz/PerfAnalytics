const Connector = require("./src/connector");
const Server = require("./src/server");
const connector = new Connector();
require("dotenv").config();

connector
  .connect()
  .then(() => {
    const server = new Server(process.env.PORT || 5000);
    server.serve();
  })
  .catch((e) => console.log(e));
