# راهنمای نصب و راه‌اندازی

## پیش‌نیازها
- Node.js (نسخه 18 یا بالاتر)
- PostgreSQL (نسخه 14 یا بالاتر)
- npm یا yarn

## مراحل نصب

### 1. نصب PostgreSQL و ایجاد دیتابیس

```bash
# ورود به PostgreSQL
psql -U postgres

# ایجاد دیتابیس
CREATE DATABASE accessories_shop;

# خروج
\q
```

### 2. اجرای Schema دیتابیس

```bash
psql -U postgres -d accessories_shop -f database/schema.sql
```

### 3. راه‌اندازی Backend

```bash
cd backend

# نصب وابستگی‌ها
npm install

# کپی فایل محیطی
cp .env.example .env

# ویرایش فایل .env و تنظیم اطلاعات دیتابیس
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=accessories_shop
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your_secret_key

# اجرای سرور
npm run dev
```

سرور Backend روی پورت 5001 اجرا می‌شود.

### 4. راه‌اندازی Frontend

```bash
cd frontend

# نصب وابستگی‌ها
npm install

# کپی فایل محیطی
cp .env.local.example .env.local

# اجرای برنامه
npm run dev
```

سرور Frontend روی پورت 3000 اجرا می‌شود.

### 5. دسترسی به برنامه

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## ایجاد کاربر ادمین (اختیاری)

برای تست قابلیت تأیید محصولات، یک کاربر با نقش admin یا expert ایجاد کنید:

```sql
-- ورود به دیتابیس
psql -U postgres -d accessories_shop

-- بروزرسانی نقش کاربر
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

## تست API با Postman یا cURL

### ثبت‌نام کاربر
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "علی احمدی",
    "email": "ali@example.com",
    "phone": "09123456789",
    "password": "123456"
  }'
```

### ایجاد محصول
```bash
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "کیف لپ‌تاپ",
    "description": "کیف لپ‌تاپ چرمی با کیفیت بالا",
    "price": 350000,
    "stock": 10,
    "category": "bags"
  }'
```

## مشکلات رایج

### خطای اتصال به دیتابیس
- مطمئن شوید PostgreSQL در حال اجرا است
- اطلاعات اتصال در فایل .env را بررسی کنید

### خطای CORS
- مطمئن شوید Backend و Frontend روی پورت‌های صحیح اجرا می‌شوند
- تنظیمات CORS در backend/src/server.js را بررسی کنید

### خطای JWT
- مطمئن شوید JWT_SECRET در فایل .env تنظیم شده است
