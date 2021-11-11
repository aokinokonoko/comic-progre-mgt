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
  xdescribe("about knex", () => {
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

    xdescribe("#update", () => {
      const expected = {
        id: 23,
        title: "test999",
        volume: 1234,
        author: "XYZ",
        publisher: "aaa",
        pages: 10000,
      };

      it("update a No.23 record", () =>{
        models.comics.updateById(expected);
        const id = 23;
        models.comics
          .getById({ id })
          .then((data) => {
            expect(data).to.include(expected);
            //console.log(data);
          });
      });
    });

    xdescribe("#delete", () => {
      const expected = {
        id: 29
      };

      it("delete a No.21 record", () =>{
        models.comics.deleteById(expected);
        const id = 29;
        models.comics
          .getById({ id })
          .then((data) => {
            expect(data).to.be.null;
          });
      });
    });
  });

  const server = setupServer();
  describe("comics API Server", () => {
    let request;
    beforeEach(() => {
      // request = chai.request(server);
      request = chai.request(server).keepOpen();
    });
    afterEach(() => {
      request.close();
    });
  
    describe("GET /api/v2/comics/:id", () => {
      it("should return No.21 comic", async () => {
        // Exercise
        const res = await request.get("/api/v2/comics/27");
        const expected = {
          id: 27,
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

      it("should not insert comic(key's value is null)", async () => {
        // Setup
        const expected = {
          //title: "すばらしい本",
          volume: 3,
          //author: "青木言太",
          publisher: "きのこ出版",
          description: "大人気ベストセラー",
          //pages: 100,
        };

        // Exercise
        const res = await request.post("/api/v2/comics").send(expected);
  
        // Assert
        res.should.have.status(400);
      });
    });

    describe("PATCH /api/v2/comics/:id", () => {
      it("should change No.24 comic", async () => {
        // Setup
        const expected = {
          title: "更新された本",
          volume: 135,
          author: "更新 太郎",
          publisher: "更新 出版",
          description: "patchしましたよ",
          pages: 246,
        };

        // Exercise
        const res = await request.patch("/api/v2/comics/24").send(expected);
        const res2 = await request.get("/api/v2/comics/24");
  
        // Assert
        res.should.have.status(204);
        res2.should.have.status(200);
        res2.should.be.json;
        expect(JSON.parse(res2.text)).to.include(expected);
      });
    });

    describe("DELETE /api/v2/comics/:id", () => {
      it("should change No.40 comic", async () => {
        // Exercise
        const res = await request.delete("/api/v2/comics/40");
        const res2 = await request.get("/api/v2/comics/40");
  
        // Assert
        res.should.have.status(204);
        res2.should.have.status(200);
        res2.should.be.json;
        expect(JSON.parse(res2.text)).to.be.deep.equal({});
      });
    });
  });
});