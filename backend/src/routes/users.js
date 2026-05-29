const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const users = db.prepare(`
      SELECT id, name, email, phone, role, created_at 
      FROM users 
      ORDER BY created_at DESC
    `).all();

        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در دریافت کاربران' });
    }
});

// Get single user (admin only)
router.get('/:id', auth, adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const user = db.prepare(`
      SELECT id, name, email, phone, role, created_at 
      FROM users 
      WHERE id = ?
    `).get(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'کاربر یافت نشد' });
        }

        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در دریافت کاربر' });
    }
});

// Update user role (admin only)
router.put('/:id/role', auth, adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        const validRoles = ['customer', 'expert', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'نقش نامعتبر است' });
        }

        // Prevent admin from changing their own role
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ success: false, message: 'نمی‌توانید نقش خود را تغییر دهید' });
        }

        db.prepare(`
      UPDATE users 
      SET role = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(role, id);

        const user = db.prepare(`
      SELECT id, name, email, phone, role 
      FROM users 
      WHERE id = ?
    `).get(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'کاربر یافت نشد' });
        }

        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در بروزرسانی نقش کاربر' });
    }
});

// Delete user (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ success: false, message: 'نمی‌توانید حساب خود را حذف کنید' });
        }

        const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: 'کاربر یافت نشد' });
        }

        res.json({
            success: true,
            message: 'کاربر با موفقیت حذف شد'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در حذف کاربر' });
    }
});

module.exports = router;
