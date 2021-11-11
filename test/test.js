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

    // afterEach(() =>
    // knex("comics")
    //   .del()
    // );

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
        })
      );
  });

  describe("#get", () => {
    beforeEach(() =>
    models.comics
      .create({ title: "test1", author: "ABC", pages: 100 })
      .then(() => {
        return models.comics.create({ title: "test2", author: "DEF", pages: 300 });
      })
      .then(() => {
        return models.comics.create({ title: "test3", author: "GHI", pages: 900 });
      })
  );

    // afterEach(() =>
    // knex("comics")
    //   .del()
    // );

    // INFO: ↓この値はDBの状態に応じて変える
    const id = 23; 
    it("get a comic record", () =>
      models
        .comics
        .getById({ id })
        .then((messages) => {
          //console.log(messages);
          expect(messages).to.include({
            title: "test3",
            author: "GHI",
            pages: 900,
          });
          expect(messages.id).to.be.a("number");
          expect(messages.sentAt).to.be.a("Date");
        })
      );
  });

});