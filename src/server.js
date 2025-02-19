const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL successfully"))
    .catch(err => console.error("Database connection error:", err));

app.get("/", (req, res) => {
    res.send("Welcome to the updated Node.js app!");
});

// Endpoint to get all items
app.get("/api/items", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM items");
        res.json(result.rows);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
    }
});

// Endpoint to get an item by ID
app.get("/api/items/:id", async (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query("SELECT * FROM items WHERE id = $1", [itemId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send("Item not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Endpoint to add a new item
app.post("/api/items", async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query("INSERT INTO items (name) VALUES ($1) RETURNING *", [name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Endpoint to update an item by ID
app.put("/api/items/:id", async (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const { name } = req.body;
    try {
        const result = await pool.query("UPDATE items SET name = $1 WHERE id = $2 RETURNING *", [name, itemId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send("Item not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
