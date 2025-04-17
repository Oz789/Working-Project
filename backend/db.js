const mysql = require("mysql2"); 
require("dotenv").config();

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL_REJECT_UNAUTHORIZED === "true"
    ? { rejectUnauthorized: true }
    : false,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// ✅ Test connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Connected to Azure MySQL Database");
    const [result] = await connection.query("SELECT DATABASE() AS name");
    console.log("✅ Connected to DB:", result[0].name);
    connection.release();
  } catch (err) {
    console.error("❌ Error connecting to database:", err.message);
    console.error("Code:", err.code);
    console.error("SQL State:", err.sqlState);
    console.error("Stack:", err.stack);
  }
})();

module.exports = db;


