const { expect, assert } = require("chai");
const config = require("../src/config");
const knex = require("knex")(config.db);
const models = require("../src/models")(knex);

describe("comics", () => {
  describe("setup", () => {
    it("able to connect to database", () =>
      knex
        .raw("select 1+1 as result")
        .catch(() => assert.fail("unable to connect to db")));

    it("has run the initial migrations", () =>
      knex("comics")
        .select()
        .catch(() => assert.fail("users table is not found.")));
  });
});