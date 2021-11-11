// for knex
const config = require("./config");
const knex = require("knex")(config.db);
const models = require("./models")(knex);

// for express
const { setupServer } = require("./server");

/** サーバのセットアップを実施。サーバの作成はserver.jsで実装 */
const server = setupServer();
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server listening on Port", PORT);
});
