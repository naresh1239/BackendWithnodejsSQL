
const mysql = require('mysql2');

const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,  // Set the port separately
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Connect to MySQL
  dbConnection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });
  
module.exports = dbConnection