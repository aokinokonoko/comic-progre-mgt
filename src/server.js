const express = require("express");
const app = express();

// TODO: Controllerを作る.
const config = require("../src/config");
const knex = require("knex")(config.db);
const models = require("./models")(knex);

const testdata = {
  name: "hello world!",
  num: 12345,
}

const setupServer = () => {
  app.use(express.json());

  app.get("/api/v1/comics", (req, res) => {
    res.send(testdata);
  });

  app.get("/api/v2/comics/:id", (req, res) => {
    const { id } = req.params;
    models.comics
      .getById({ id })
      .then(comic => res.json(comic))
      .catch((err) => res.status(400).send(err.message));
  });

  app.post("/api/v2/comics", (req, res) => {
    models.comics
      .create(req.body)
      .then(comic => res.json(comic))
      .catch((err) => res.status(400).send(err.message));
  });

  app.patch("/api/v2/comics", (req, res) => {
    models.comics
      .create(req.body)
      .then(comic => res.status(204).json(comic))
      .catch((err) => res.status(400).send(err.message));
  });

  return app;
};

// TODO: できればimport/exportにしたい.
module.exports = {setupServer}; 