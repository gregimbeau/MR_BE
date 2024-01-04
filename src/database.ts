import { Pool } from "pg";

const pool = new Pool({
  user: "username",
  host: "localhost",
  database: "modaresa",
  password: "password",
  port: 5432,
});

export default pool;
