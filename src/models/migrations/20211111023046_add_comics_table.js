
exports.up = function(knex) {
  return knex.schema.createTable("comics", (t) => {
    // create the 'comis' table
    t.increments() // auto-incrementing id column
      .index(); // index this column

    t.string("title")
    .notNullable() // add a not-null constraint to this column

    t.integer("volume")

    t.string("author")
    .notNullable() // add a not-null constraint to this column

    t.string("publisher")

    t.integer("pages")
    .notNullable()

    t.string("description")

    t.timestamp("insert_at")
      .notNullable()
      .defaultTo(knex.fn.now()); // default to the current time
  });
  
};

exports.down = function(knex) {
  // undo this migration by destroying the 'comics' table
  return knex.schema.dropTable("user_messages");
};
