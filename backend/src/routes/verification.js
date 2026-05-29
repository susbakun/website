const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');

// Verify product (admin/expert only)
router.post('/product/:productId', auth, adminAuth, async (req, res) => {
    const { productId } = req.params;
    const { verification_notes, verification_seal } = req.body;
    const verifiedBy = req.user.id;

    try {
        // Start transaction
        db.prepare('BEGIN').run();

        // Update product
        db.prepare(`
      UPDATE products 
      SET is_verified = 1, verified_by = ?, verified_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(verifiedBy, productId);

        // Create verification record
        const result = db.prepare(`
      INSERT INTO product_verifications (product_id, verified_by, verification_notes, verification_seal)
      VALUES (?, ?, ?, ?)
    `).run(productId, verifiedBy, verification_notes, verification_seal);

        const verification = db.prepare('SELECT * FROM product_verifications WHERE id = ?').get(result.lastInsertRowid);

        // Commit transaction
        db.prepare('COMMIT').run();

        res.json({
            success: true,
            verification: verification
        });
    } catch (error) {
        db.prepare('ROLLBACK').run();
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در تأیید محصول' });
    }
});

// Get verification details
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const verification = db.prepare(`
      SELECT pv.*, u.name as verified_by_name, u.email as verified_by_email
      FROM product_verifications pv
      JOIN users u ON pv.verified_by = u.id
      WHERE pv.product_id = ?
      ORDER BY pv.verified_at DESC
      LIMIT 1
    `).get(productId);

        if (!verification) {
            return res.status(404).json({ success: false, message: 'اطلاعات تأیید یافت نشد' });
        }

        res.json({
            success: true,
            verification: verification
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در دریافت اطلاعات تأیید' });
    }
});

module.exports = router;
