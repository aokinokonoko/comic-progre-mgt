const express = require("express");
const app = express();

const testdata = {
  name: "hello world!",
  num: 12345,
}

const setupServer = () => {
  app.get("/api/comics", (req, res) => {
    res.send(testdata);
  });

  return app;
};

// TODO: できればimport/exportにしたい.
module.exports = {setupServer}; 