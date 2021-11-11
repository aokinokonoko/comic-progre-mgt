module.exports = (knex) => {
  return {
    comics: require("./comics")(knex)
  };
};