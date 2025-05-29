// const knex = require("knex");
// const knexFile = require("./knexfile");
// const environment = process.env.NODE_ENV;

// class MysqlConn {
//   constructor() {
//     this.db = knex(knexFile[environment]);
//   }
//   get getDB() {
//     return this.db;
//   }

//   static getInstance() {
//     if (!this.instance) {
//       this.instance = new MysqlConn();
//     }
//     return this.instance;
//   }
// }

// module.exports = MysqlConn;

const knex = require("knex");
const knexFile = require("./knexfile");
const environment = "development";
module.exports = knex(knexFile[environment]);
