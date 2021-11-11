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

  describe("#create", () => {
    const title = "test1";
    const author = "ABC";
    const pages = 100;

    it("creates a comic record", () =>
      models
        .comics
        .create({ title, author, pages })
        .then((messages) => {
          //console.log(messages);
          expect(messages).to.include({
            title: title,
            author: author,
            pages: pages,
          });
          expect(messages.id).to.be.a("number");
          expect(messages.sentAt).to.be.a("Date");
        }));
  });
});