const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Create order
router.post('/', auth, async (req, res) => {
    const { items, shipping_address } = req.body;
    const userId = req.user.id;

    try {
        db.prepare('BEGIN').run();

        // Calculate total
        let totalAmount = 0;
        for (const item of items) {
            const product = db.prepare('SELECT price, stock FROM products WHERE id = ?').get(item.product_id);

            if (!product) {
                throw new Error(`محصول با شناسه ${item.product_id} یافت نشد`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`موجودی کافی نیست برای محصول ${item.product_id}`);
            }

            totalAmount += product.price * item.quantity;
        }

        // Calculate shipping cost
        const freeShippingThreshold = parseFloat(process.env.FREE_SHIPPING_THRESHOLD) || 500000;
        const shippingCost = totalAmount >= freeShippingThreshold ? 0 : 50000;

        // Generate tracking code
        const trackingCode = `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Create order
        const orderResult = db.prepare(`
      INSERT INTO orders (user_id, total_amount, shipping_cost, shipping_address, tracking_code)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, totalAmount, shippingCost, shipping_address, trackingCode);

        const orderId = orderResult.lastInsertRowid;

        // Create order items and update stock
        for (const item of items) {
            const product = db.prepare('SELECT price FROM products WHERE id = ?').get(item.product_id);

            db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `).run(orderId, item.product_id, item.quantity, product.price);

            db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.product_id);
        }

        db.prepare('COMMIT').run();

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

        res.status(201).json({
            success: true,
            order: {
                ...order,
                final_amount: parseFloat(order.total_amount) + parseFloat(order.shipping_cost)
            }
        });
    } catch (error) {
        db.prepare('ROLLBACK').run();
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'خطا در ثبت سفارش' });
    }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = db.prepare(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `).all(req.user.id);

        // Get items for each order
        for (let order of orders) {
            const items = db.prepare(`
        SELECT oi.*, p.name as product_name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).all(order.id);
            order.items = items;
        }

        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در دریافت سفارشات' });
    }
});

// Get all orders (admin only)
router.get('/all', auth, async (req, res) => {
    // Check if user is admin or expert
    if (req.user.role !== 'admin' && req.user.role !== 'expert') {
        return res.status(403).json({ success: false, message: 'دسترسی محدود' });
    }

    try {
        const orders = db.prepare(`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `).all();

        // Get items for each order
        for (let order of orders) {
            const items = db.prepare(`
        SELECT oi.*, p.name as product_name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).all(order.id);
            order.items = items;
        }

        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در دریافت سفارشات' });
    }
});

// Update order status (admin only)
router.put('/:orderId/status', auth, async (req, res) => {
    // Check if user is admin or expert
    if (req.user.role !== 'admin' && req.user.role !== 'expert') {
        return res.status(403).json({ success: false, message: 'دسترسی محدود' });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'وضعیت نامعتبر است' });
    }

    try {
        db.prepare(`
      UPDATE orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(status, orderId);

        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'سفارش یافت نشد' });
        }

        res.json({
            success: true,
            order: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در بروزرسانی وضعیت سفارش' });
    }
});

// Track order by tracking code
router.get('/track/:trackingCode', async (req, res) => {
    try {
        const { trackingCode } = req.params;

        const order = db.prepare(`
      SELECT id, status, tracking_code, created_at, updated_at 
      FROM orders 
      WHERE tracking_code = ?
    `).get(trackingCode);

        if (!order) {
            return res.status(404).json({ success: false, message: 'سفارش یافت نشد' });
        }

        res.json({
            success: true,
            order: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در پیگیری سفارش' });
    }
});

// Request return (within 30 days)
router.post('/return/:orderId', auth, async (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    try {
        // Check if order exists and belongs to user
        const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(orderId, userId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'سفارش یافت نشد' });
        }

        // Check if within 30 days
        const orderDate = new Date(order.created_at);
        const now = new Date();
        const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

        if (daysDiff > 30) {
            return res.status(400).json({
                success: false,
                message: 'مهلت ۳۰ روزه بازگشت کالا به پایان رسیده است'
            });
        }

        // Create return request
        const result = db.prepare(`
      INSERT INTO returns (order_id, user_id, reason, refund_amount)
      VALUES (?, ?, ?, ?)
    `).run(orderId, userId, reason, parseFloat(order.total_amount) + parseFloat(order.shipping_cost));

        const returnRecord = db.prepare('SELECT * FROM returns WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            return: returnRecord
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطا در ثبت درخواست بازگشت' });
    }
});

module.exports = router;
