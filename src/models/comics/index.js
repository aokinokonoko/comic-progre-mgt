const moment = require("moment");

// アロー関数の書き方に対応してない...のでfunction()で定義する.
const Comics =  function(dbUser) {
  this.id = dbUser.id;
  this.title = dbUser.title;
  this.volume = dbUser.volume;
  this.author = dbUser.author;
  this.publisher = dbUser.publisher;
  this.pages = dbUser.pages;
  this.description = dbUser.description;
  this.sentAt = new Date(dbUser.insert_at);
}

Comics.prototype.serialize = function() {
  return {
    id: this.id,
    title: this.title,
    volume: this.volume,
    author: this.author,
    publisher: this.publisher,
    pages: this.pages,
    description: this.description,
    sentAt: moment(this.insertAt).format("hh:mm:ss"),
  };
};

const createComics = (knex) => {
  return (params) => {
    const { title, volume, author, publisher, pages, description} = params;
    return knex("comics")
      .insert({
        title: title,
        volume: volume,
        author: author,
        publisher: publisher,
        pages: pages,
        description: description
      })
      .then(() => {
        // TODO: "title"項目もuniqueにする.
        return knex("comics")
          .where({title: title})
          .select();
      })
      .then((comics) => new Comics(comics.pop()))
      .catch((err) => {
        // sanitize known errors
        if (
          err.message.match("duplicate key value") ||
          err.message.match("UNIQUE constraint failed")
        )
        // return Promise.reject(new Error("That title already exists"));

        // throw unknown errors
        return Promise.reject(err);
      });
  };
};

const getComicsById = (knex) => {
  return (params) => {
    const { id } = params;
    return knex("comics")
      .where({id: id})
      .select()
      .then((comics) => {
        if (comics.length) return new Comics(comics.pop());

        throw new Error(`Error finding comics No.${id}`);
      });
  };
};

const updateComicsById = (knex) => {
  return (params) => {
    const { id, title, volume, author, publisher, pages, description } = params;
    return knex("comics")
      .where({id: id})
      .update({
        title: title,
        volume: volume,
        author: author,
        publisher: publisher,
        pages: pages,
        description: description
      })
      .then(() => {
        return knex("comics")
          .where({id: id})
          .select();
      })
      .then((comics) => new Comics(comics.pop()))
      .catch((err) => {
        // sanitize known errors
        if (
          err.message.match("duplicate key value") ||
          err.message.match("UNIQUE constraint failed")
        )
        // return Promise.reject(new Error("That title already exists"));

        // throw unknown errors
        return Promise.reject(err);
      });
  };
};

const deleteComicsById = (knex) => {
  return (params) => {
    const { id } = params;
    return knex("comics")
      .where({id: id})
      .del()
      .catch((err) => {
        // throw unknown errors
        return Promise.reject(err);
      });
  };
};

module.exports = (knex) => {
  return {
    create: createComics(knex),
    getById: getComicsById(knex),
    updateById: updateComicsById(knex),
    deleteById: deleteComicsById(knex),
  };
};