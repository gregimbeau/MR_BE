import { Pool } from "pg";

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  user: isProduction ? process.env.DB_USER : "username",
  host: isProduction ? process.env.DB_HOST : "localhost",
  database: isProduction ? process.env.DB_NAME : "modaresa",
  password: isProduction ? process.env.DB_PASSWORD : "password",
  port: isProduction ? parseInt(process.env.DB_PORT, 10) : 5432,
});

export default pool;
