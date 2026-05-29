# مستندات API

Base URL: `http://localhost:5001/api`

## Authentication

### ثبت‌نام
```
POST /auth/register
```

**Body:**
```json
{
  "name": "علی احمدی",
  "email": "ali@example.com",
  "phone": "09123456789",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "علی احمدی",
    "email": "ali@example.com",
    "phone": "09123456789",
    "role": "customer"
  }
}
```

### ورود
```
POST /auth/login
```

**Body:**
```json
{
  "email": "ali@example.com",
  "password": "123456"
}
```

## Products

### دریافت لیست محصولات
```
GET /products
GET /products?category=bags
GET /products?verified=true
```

### دریافت جزئیات محصول
```
GET /products/:id
```

### ایجاد محصول (نیاز به احراز هویت)
```
POST /products
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "کیف لپ‌تاپ",
  "description": "کیف لپ‌تاپ چرمی",
  "price": 350000,
  "stock": 10,
  "category": "bags",
  "image_url": "https://example.com/image.jpg"
}
```

## Orders

### ثبت سفارش
```
POST /orders
Authorization: Bearer {token}
```

**Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "shipping_address": "تهران، خیابان ولیعصر، پلاک 123"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": 1,
    "user_id": 1,
    "total_amount": "700000.00",
    "shipping_cost": "0.00",
    "status": "pending",
    "tracking_code": "TRK1234567890",
    "final_amount": 700000
  }
}
```

### دریافت سفارشات کاربر
```
GET /orders/my-orders
Authorization: Bearer {token}
```

### پیگیری سفارش با کد رهگیری
```
GET /orders/track/:trackingCode
```

### درخواست بازگشت کالا
```
POST /orders/return/:orderId
Authorization: Bearer {token}
```

**Body:**
```json
{
  "reason": "کالا مطابق انتظار نبود"
}
```

## Verification

### تأیید محصول (فقط ادمین/کارشناس)
```
POST /verification/product/:productId
Authorization: Bearer {token}
```

**Body:**
```json
{
  "verification_notes": "محصول بررسی و تأیید شد",
  "verification_seal": "SEAL123456"
}
```

### دریافت اطلاعات تأیید محصول
```
GET /verification/product/:productId
```

## Status Codes

- `200` - موفق
- `201` - ایجاد شد
- `400` - درخواست نامعتبر
- `401` - احراز هویت نشده
- `403` - دسترسی محدود
- `404` - یافت نشد
- `500` - خطای سرور

## وضعیت‌های سفارش

- `pending` - در انتظار پردازش
- `processing` - در حال پردازش
- `shipped` - ارسال شده
- `delivered` - تحویل داده شده
- `cancelled` - لغو شده
