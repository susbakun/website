const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'دسترسی غیرمجاز - توکن یافت نشد' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'توکن نامعتبر است' });
    }
};

const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'expert') {
        return res.status(403).json({ success: false, message: 'دسترسی محدود - فقط برای ادمین و کارشناس' });
    }
    next();
};

module.exports = { auth, adminAuth };
