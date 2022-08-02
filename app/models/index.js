const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.reviews = require("./review.model.js")(sequelize, Sequelize);
db.categories = require("./categories.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);

db.users.hasMany(db.messages, { as: "messages"});
db.messages.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
  foreignKeyConstraint: true
    , onDelete: 'cascade'
});

db.categories.hasMany(db.messages, { as: "messages"});
db.messages.belongsTo(db.users, {
  foreignKey: "categoryId",
  as: "category",
  foreignKeyConstraint: true
    , onDelete: 'cascade'
});



module.exports = db;