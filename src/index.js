/** サーバのセットアップを実施。サーバの作成はserver.jsで実装 */
const { setupServer } = require("./server");

const server = setupServer();
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server listening on Port", PORT);
});
