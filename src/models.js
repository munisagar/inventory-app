const pool = require("./database");

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);
    console.log("Table 'products' is ready");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};

// Call the function to create the table
createTable();
