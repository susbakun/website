const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, verified } = req.query;
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (verified === 'true') {
            query += ' AND is_verified = 1';
        }

        query += ' ORDER BY created_at DESC';

        const products = db.prepare(query).all(...params);

        res.json({
            success: true,
            count: products.length,
            products: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در دریافت محصولات' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = db.prepare(`
      SELECT p.*, pv.verification_notes, pv.verification_seal, pv.verified_at,
             u.name as verified_by_name
      FROM products p
      LEFT JOIN product_verifications pv ON p.id = pv.product_id
      LEFT JOIN users u ON pv.verified_by = u.id
      WHERE p.id = ?
    `).get(id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'محصول یافت نشد' });
        }

        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در دریافت محصول' });
    }
});

// Create product (admin only)
router.post('/', auth, async (req, res) => {
    const { name, description, price, stock, category, image_url } = req.body;

    try {
        const result = db.prepare(`
      INSERT INTO products (name, description, price, stock, category, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, description, price, stock, category, image_url);

        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در ایجاد محصول' });
    }
});

module.exports = router;
