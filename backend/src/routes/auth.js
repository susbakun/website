const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

// Register
router.post('/register', [
    body('name').notEmpty().withMessage('نام الزامی است'),
    body('email').isEmail().withMessage('ایمیل معتبر نیست'),
    body('phone').notEmpty().withMessage('شماره تلفن الزامی است'),
    body('password').isLength({ min: 6 }).withMessage('رمز عبور باید حداقل ۶ کاراکتر باشد')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    try {
        // Check if user exists
        const userExists = db.prepare('SELECT * FROM users WHERE email = ? OR phone = ?').get(email, phone);

        if (userExists) {
            return res.status(400).json({ success: false, message: 'کاربر قبلاً ثبت‌نام کرده است' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const result = db.prepare(`
      INSERT INTO users (name, email, phone, password)
      VALUES (?, ?, ?, ?)
    `).run(name, email, phone, hashedPassword);

        const user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(result.lastInsertRowid);

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در ثبت‌نام' });
    }
});

// Login
router.post('/login', [
    body('email').isEmail().withMessage('ایمیل معتبر نیست'),
    body('password').notEmpty().withMessage('رمز عبور الزامی است')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user) {
            return res.status(401).json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در ورود' });
    }
});

module.exports = router;
