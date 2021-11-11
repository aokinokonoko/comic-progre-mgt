const express = require("express");
const app = express();

// TODO: Controllerを作る.
const config = require("../src/config");
const knex = require("knex")(config.db);
const models = require("./models")(knex);

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
      swagger: "2.0",
      info: {
          title: "漫画読書記録API",
          version: "1.0.0",
          description: "漫画の読書記録をするAPI（の予定。現時点はまだ漫画の情報の格納のみ.）",
      }
  },
  apis: ["./src/server.js"],
});

const testdata = {
  name: "hello world!",
  num: 12345,
}

const setupServer = () => {
  app.use(express.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/api/v1/comics", (req, res) => {
    res.send(testdata);
  });

  /**
   * @swagger
   * /api/v2/comics/{id}:
   *   get:
   *     description: 指定したidの漫画の情報を取得する.
   *     parameters:
   *       - name: id
   *         description: 取得したい漫画のID
   *         in: path
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: 成功時のレスポンス
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: integer
   *               example: 1
   *             title:
   *               type: string
   *               example: 五等分の花嫁
   *             volume:
   *               type: integer
   *               example: 1
   *             author: 
   *               type: string
   *               example: 春場ねぎ
   *             publisher:
   *               type: string
   *               example: 講談社
   *             pages:
   *               type: integer
   *               example: 196
   *             descripton:
   *               type: string
   *               example: なんか適当なコメント
   *             sentAt:
   *               type: date
   *               example: 2021-11-11T07:04:21.813Z
   */
  app.get("/api/v2/comics/:id", (req, res) => {
    const { id } = req.params;
    models.comics
      .getById({ id })
      .then(comic => res.json(comic))
      .catch((err) => {
        if (err.message.match("Error finding comics")){
          return res.status(200).json({});
        };
        // throw unknown errors
        return res.status(400).send(err.message)
      });
  });

  /**
   * @swagger
   * /api/v2/comics:
   *   post:
   *     description: 漫画の情報を登録する.
   *     parameters:
   *       - name: body
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             title:
   *               required: true
   *               type: string
   *               example: テスト用book
   *             volume:
   *               required: false
   *               type: integer
   *               example: 12
   *             author:
   *               required: true
   *               type: string
   *               example: 名無し太郎
   *             publisher:
   *               required: false
   *               type: string
   *               example: 名無し出版
   *             pages:
   *               required: true
   *               type: integer
   *               example: 120
   *             description:
   *               required: false
   *               type: string
   *               example: なんかのコメント
   *     responses:
   *       200:
   *         description: 成功時のレスポンス
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: integer
   *               example: 1
   *             title:
   *               type: string
   *               example: 五等分の花嫁
   *             volume:
   *               type: integer
   *               example: 1
   *             author: 
   *               type: string
   *               example: 春場ねぎ
   *             publisher:
   *               type: string
   *               example: 講談社
   *             pages:
   *               type: integer
   *               example: 196
   *             descripton:
   *               type: string
   *               example: なんか適当なコメント
   *             sentAt:
   *               type: date
   *               example: 2021-11-11T07:04:21.813Z
   *       400:
   *         description: 必須項目がnullの場合のレスポンス
   *         schema:
   *           type: text
   *           example: Not null key's value is null.
   */
  app.post("/api/v2/comics", (req, res) => {
    if(req.body.title && req.body.author && req.body.pages){
      models.comics
      .create(req.body)
      .then(comic => res.json(comic))
      .catch((err) => res.status(400).send(err.message));
    } else {
      res.status(400).send("Not null key's value is null.");
    }
  });

  /**
   * @swagger
   * /api/v2/comics/{id}:
   *   patch:
   *     description: 登録された漫画の情報を更新する.
   *     parameters:
   *       - name: id
   *         description: 更新したい漫画のID
   *         in: path
   *         required: true
   *         type: integer
   *       - name: body
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             title:
   *               required: false
   *               type: string
   *               example: 更新テスト用book
   *             volume:
   *               required: false
   *               type: integer
   *               example: 120
   *             author:
   *               required: false
   *               type: string
   *               example: 更新名無し太郎
   *             publisher:
   *               required: false
   *               type: string
   *               example: 更新名無し出版
   *             pages:
   *               required: false
   *               type: integer
   *               example: 120
   *             description:
   *               required: false
   *               type: string
   *               example: 更新：なんかのコメント
   *     responses:
   *       204:
   *         description: 成功時のレスポンス
   */
  app.patch("/api/v2/comics/:id", (req, res) => {
    const { id } = req.params;
    models.comics
      .updateById(Object.assign(req.body, {id: id}))
      .then(comic => res.status(204).json(comic))
      .catch((err) => res.status(400).send(err.message));
  });

  /**
   * @swagger
   * /api/v2/comics/{id}:
   *   delete:
   *     description: 登録された漫画の情報を削除する.
   *     parameters:
   *       - name: id
   *         description: 更新したい漫画のID
   *         in: path
   *         required: true
   *         type: integer
   *     responses:
   *       204:
   *         description: 成功時のレスポンス
   */
  app.delete("/api/v2/comics/:id", (req, res) => {
    const { id } = req.params;
    models.comics
      .deleteById({ id })
      .then(comic => res.status(204).json(comic))
      .catch((err) => res.status(400).send(err.message));
  });

  return app;
};

// TODO: できればimport/exportにしたい.
module.exports = {setupServer}; 