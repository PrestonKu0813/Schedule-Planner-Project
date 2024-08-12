const key = require("./key.json");
const knex = require("knex");

class MysqlConn {
    constructor () {
      this.db = knex(key)
    }
    get getDB () {
      return this.db
    }

    static getInstance () {
      if (!this.instance) {
        this.instance = new MysqlConn()
      }
      return this.instance
    }
  }

module.exports = MysqlConn;
