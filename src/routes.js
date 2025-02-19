const express = require("express");
const pool = require("./database");
const router = express.Router();

// Get all products
router.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});

// Get product by ID
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});

// Add a new product
router.post("/products", async (req, res) => {
  const { name, price } = req.body;
  try {
    const result = await pool.query("INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *", [name, price]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database insert failed" });
  }
});

// Delete a product
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database delete failed" });
  }
});

module.exports = router;
