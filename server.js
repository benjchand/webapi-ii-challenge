const express = require("express");
const expressRouter = require("./expressRouter/expressRouter");

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.send(" <h2> Welcome to the Lambda API </h2>");
});

server.use("/api/posts", expressRouter);

module.exports = server;
