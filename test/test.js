const { expect, assert } = require("chai");
const config = require("../src/config");
const knex = require("knex")(config.db);
const models = require("../src/models")(knex);

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();
const { setupServer } = require("../src/server");

describe("comics", () => {
  xdescribe("setup", () => {
    it("able to connect to database", () =>
      knex
        .raw("select 1+1 as result")
        .catch(() => assert.fail("unable to connect to db")));

    it("has run the initial migrations", () =>
      knex("comics")
        .select()
        .catch(() => assert.fail("users table is not found.")));
  });

  xdescribe("#create", () => {
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

  xdescribe("#get", () => {
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

  const server = setupServer();
  describe("comics API Server", () => {
    let request;
    let request2;
    // TODO: keepopenにする！
    beforeEach(() => {
      request = chai.request(server);
      request2 = chai.request(server);
    });
  
    describe("GET /api/v2/comics/:id", () => {
      it("should return No.21 comic", async () => {
        // Exercise
        const res = await request.get("/api/v2/comics/23");
        const expected = {
          id: 23,
          title: "test3",
          author: "GHI",
          pages: 900,
        };
  
        // Assert
        res.should.have.status(200);
        res.should.be.json;
        expect(JSON.parse(res.text)).to.include(expected);
      });
    });

    describe("POST /api/v2/comics", () => {
      it("should insert comic", async () => {
        // Setup
        const expected = {
          title: "すばらしい本",
          volume: 3,
          author: "青木言太",
          publisher: "きのこ出版",
          description: "大人気ベストセラー",
          pages: 100,
        };

        // Exercise
        const res = await request.post("/api/v2/comics").send(expected);
  
        // Assert
        res.should.have.status(200);
        res.should.be.json;
        expect(JSON.parse(res.text)).to.include(expected);
      });
    });
  });
});