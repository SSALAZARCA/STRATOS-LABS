const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'stratos_labs',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- PRODUCTS ---
app.get('/api/products/active', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE status = "active"');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', async (req, res) => {
    try {
        const { name, description, price, category, image_url, model_url } = req.body;
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, category, image_url, model_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, category, image_url, model_url]
        );
        res.json({ id: result.insertId, ...req.body });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ORDERS ---
app.get('/api/orders', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { customer_email, total, items } = req.body;
        const [result] = await pool.query(
            'INSERT INTO orders (customer_email, total, items) VALUES (?, ?, ?)',
            [customer_email, total, JSON.stringify(items)]
        );
        res.json({ id: result.insertId, ...req.body });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders/stats', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT IFNULL(SUM(total), 0) as totalRevenue, COUNT(*) as totalSales FROM orders');
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- CONTACTS ---
app.get('/api/contacts', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/contacts', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const [result] = await pool.query(
            'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );
        res.json({ id: result.insertId, ...req.body });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- SETTINGS ---
app.get('/api/settings', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM settings');
        const settingsMap = {};
        rows.forEach(s => settingsMap[s.key] = s.value);
        res.json(settingsMap);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/settings/:key', async (req, res) => {
    try {
        const { value } = req.body;
        await pool.query(
            'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
            [req.params.key, value, value]
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
