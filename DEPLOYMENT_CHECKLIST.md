# ✅ چک‌لیست استقرار

## قبل از استقرار

- [ ] فایل `.gitignore` را بررسی کنید (فایل‌های `.env` نباید commit شوند)
- [ ] JWT_SECRET قوی تولید کنید
- [ ] رمز عبور ادمین پیش‌فرض را تغییر دهید
- [ ] کد را در GitHub push کنید

## استقرار Backend (Railway/Render)

- [ ] حساب کاربری ایجاد کنید
- [ ] پروژه جدید از GitHub ایجاد کنید
- [ ] Root Directory را به `backend` تنظیم کنید
- [ ] متغیرهای محیطی را اضافه کنید:
  - [ ] `PORT=5001`
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET=<your-secure-secret>`
  - [ ] `JWT_EXPIRE=7d`
  - [ ] `FREE_SHIPPING_THRESHOLD=500000`
  - [ ] `ALLOWED_ORIGINS=https://your-frontend.vercel.app`
- [ ] Deploy کنید
- [ ] URL بکند را کپی کنید
- [ ] Health check را تست کنید: `https://your-backend.railway.app/health`
- [ ] دیتابیس را seed کنید (اگر نیاز است)

## استقرار Frontend (Vercel)

### روش CLI:

```bash
# نصب Vercel CLI
npm install -g vercel

# وارد دایرکتری پروژه شوید
cd /Users/amir/Nextjs-Projects/website

# لاگین کنید
vercel login

# Deploy کنید
vercel

# سوالات:
# - Directory: ./frontend
# - Project name: accessories-shop (یا نام دلخواه)

# متغیرهای محیطی را اضافه کنید
vercel env add NEXT_PUBLIC_API_URL production
# مقدار: https://your-backend.railway.app/api

vercel env add NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD production
# مقدار: 500000

# Deploy نهایی
vercel --prod
```

### روش Dashboard:

- [ ] به vercel.com بروید
- [ ] "Add New Project" کلیک کنید
- [ ] مخزن GitHub را انتخاب کنید
- [ ] تنظیمات:
  - [ ] Framework: Next.js
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `.next`
- [ ] Environment Variables:
  - [ ] `NEXT_PUBLIC_API_URL` = `https://your-backend.railway.app/api`
  - [ ] `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD` = `500000`
- [ ] Deploy کنید

## بعد از استقرار

- [ ] Frontend را باز کنید و بررسی کنید
- [ ] صفحه اصلی لود می‌شود؟
- [ ] محصولات نمایش داده می‌شوند؟
- [ ] ورود به سیستم کار می‌کند؟
  - Email: `admin@shop.com`
  - Password: `admin123`
- [ ] پنل ادمین در دسترس است؟ (`/admin`)
- [ ] سفارش‌گذاری کار می‌کند؟
- [ ] سبد خرید کار می‌کند؟

## عیب‌یابی

### محصولات نمایش داده نمی‌شوند:
1. Console مرورگر را بررسی کنید (F12)
2. آیا خطای CORS وجود دارد؟
   - `ALLOWED_ORIGINS` را در backend بررسی کنید
3. آیا API URL صحیح است؟
   - متغیر `NEXT_PUBLIC_API_URL` را بررسی کنید

### خطای 500 در Backend:
1. لاگ‌های Railway/Render را بررسی کنید
2. متغیرهای محیطی را بررسی کنید
3. دیتابیس را seed کنید

### صفحه سفید یا خطای Build:
1. لاگ‌های Vercel را بررسی کنید
2. مطمئن شوید Root Directory = `frontend`
3. مطمئن شوید `npm run build` در local کار می‌کند

## دامنه سفارشی (اختیاری)

### Vercel:
- Settings → Domains → Add Domain
- DNS را تنظیم کنید

### Backend:
- دامنه جدید را به `ALLOWED_ORIGINS` اضافه کنید
- Backend را دوباره deploy کنید

## امنیت

- [ ] HTTPS فعال است (Vercel و Railway به صورت پیش‌فرض)
- [ ] JWT_SECRET قوی است (حداقل 32 کاراکتر تصادفی)
- [ ] رمز عبور ادمین تغییر کرده
- [ ] CORS فقط برای دامنه‌های مجاز تنظیم شده
- [ ] فایل‌های `.env` در git نیستند

## پشتیبان‌گیری

- [ ] دیتابیس SQLite را دانلود کنید (از Railway/Render)
- [ ] کد را در GitHub نگه دارید
- [ ] متغیرهای محیطی را در جای امن ذخیره کنید

---

## لینک‌های مفید

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Railway Dashboard](https://railway.app/dashboard)
- [Render Dashboard](https://dashboard.render.com/)
- [مستندات Vercel](https://vercel.com/docs)
- [مستندات Railway](https://docs.railway.app/)

---

**موفق باشید! 🚀**
