import pgPromise from "pg-promise";

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../dbconfig.json")[env];

const pgp = pgPromise();

const db = pgp(config);

export { db, pgp };
