# 🚀 راهنمای سریع استقرار (5 دقیقه)

## مرحله 1: آماده‌سازی Git (اگر هنوز انجام نداده‌اید)

```bash
# مقداردهی اولیه Git
git init

# اضافه کردن فایل‌ها
git add .

# اولین commit
git commit -m "Initial commit"

# ایجاد مخزن در GitHub
# به github.com بروید و یک repository جدید ایجاد کنید

# اتصال به GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## مرحله 2: استقرار Backend روی Railway

### گزینه A: از طریق Dashboard (آسان‌تر)

1. **ثبت‌نام**: به [railway.app](https://railway.app) بروید
2. **پروژه جدید**: "New Project" → "Deploy from GitHub repo"
3. **انتخاب مخزن**: مخزن GitHub خود را انتخاب کنید
4. **تنظیمات**:
   - Settings → Root Directory: `backend`
   - Settings → Start Command: `npm start`
5. **متغیرهای محیطی** (Variables):
   ```
   PORT=5001
   NODE_ENV=production
   JWT_SECRET=your_very_secure_random_string_here_at_least_32_chars
   JWT_EXPIRE=7d
   FREE_SHIPPING_THRESHOLD=500000
   ALLOWED_ORIGINS=http://localhost:3000
   ```
6. **Deploy**: منتظر بمانید تا deploy شود
7. **URL را کپی کنید**: از Settings → Domains (مثلاً: `https://your-app.up.railway.app`)

### گزینه B: Render (رایگان)

1. به [render.com](https://render.com) بروید
2. "New" → "Web Service"
3. مخزن GitHub را متصل کنید
4. تنظیمات:
   - Name: `accessories-shop-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. متغیرهای محیطی را اضافه کنید (مانند بالا)
6. "Create Web Service"

## مرحله 3: استقرار Frontend روی Vercel

### روش A: CLI (سریع‌تر)

```bash
# نصب Vercel CLI
npm install -g vercel

# لاگین
vercel login

# Deploy
vercel

# پاسخ به سوالات:
# - Set up and deploy? Y
# - Which scope? (حساب خود)
# - Link to existing project? N
# - Project name? accessories-shop
# - In which directory? ./frontend

# اضافه کردن متغیرهای محیطی
vercel env add NEXT_PUBLIC_API_URL production
# وارد کنید: https://YOUR-BACKEND-URL.railway.app/api

vercel env add NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD production
# وارد کنید: 500000

# Deploy نهایی
vercel --prod
```

### روش B: Dashboard (آسان‌تر)

1. به [vercel.com](https://vercel.com) بروید و لاگین کنید
2. "Add New" → "Project"
3. "Import Git Repository" → مخزن خود را انتخاب کنید
4. **تنظیمات پروژه**:
   - Framework Preset: **Next.js**
   - Root Directory: **frontend**
   - Build Command: `npm run build` (پیش‌فرض)
   - Output Directory: `.next` (پیش‌فرض)
5. **Environment Variables**:
   - کلیک روی "Environment Variables"
   - اضافه کنید:
     ```
     NEXT_PUBLIC_API_URL = https://YOUR-BACKEND-URL.railway.app/api
     NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD = 500000
     ```
6. "Deploy" را کلیک کنید
7. منتظر بمانید (2-3 دقیقه)

## مرحله 4: به‌روزرسانی CORS

پس از دریافت URL Vercel، باید Backend را به‌روز کنید:

1. به Dashboard Railway/Render بروید
2. Variables → `ALLOWED_ORIGINS` را ویرایش کنید:
   ```
   https://your-vercel-app.vercel.app,http://localhost:3000
   ```
3. Backend به صورت خودکار دوباره deploy می‌شود

## مرحله 5: تست

1. **Frontend را باز کنید**: `https://your-vercel-app.vercel.app`
2. **بررسی محصولات**: آیا محصولات نمایش داده می‌شوند؟
3. **ورود به سیستم**:
   - Email: `admin@shop.com`
   - Password: `admin123`
4. **پنل ادمین**: `/admin`

## ❌ مشکل دارید؟

### محصولات نمایش داده نمی‌شوند

1. **Console مرورگر را باز کنید** (F12)
2. **خطای CORS؟**
   - `ALLOWED_ORIGINS` را در Railway بررسی کنید
   - مطمئن شوید URL Vercel را اضافه کرده‌اید
3. **خطای Network؟**
   - `NEXT_PUBLIC_API_URL` را در Vercel بررسی کنید
   - مطمئن شوید `/api` در انتها دارد

### خطای 500

1. **لاگ‌های Backend** را در Railway/Render بررسی کنید
2. **متغیرهای محیطی** را بررسی کنید
3. **دیتابیس را seed کنید**:
   - در Railway: Settings → Deploy → Manual Deploy
   - یا از طریق Railway CLI: `railway run npm run seed`

### صفحه سفید

1. **لاگ‌های Vercel** را بررسی کنید (Deployments → لاگ‌ها)
2. مطمئن شوید **Root Directory = frontend**
3. در local تست کنید: `cd frontend && npm run build`

## 🔒 امنیت (مهم!)

قبل از استفاده واقعی:

1. **JWT_SECRET را تغییر دهید**:
   ```bash
   # تولید یک رشته تصادفی
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   
2. **رمز عبور ادمین را تغییر دهید**:
   - وارد پنل ادمین شوید
   - به بخش Users بروید
   - رمز عبور admin را تغییر دهید

3. **CORS را محدود کنید**:
   - فقط دامنه‌های مجاز را در `ALLOWED_ORIGINS` قرار دهید

## 📱 دامنه سفارشی (اختیاری)

### Vercel:
1. Settings → Domains → Add
2. دامنه خود را وارد کنید
3. DNS را تنظیم کنید (راهنما نمایش داده می‌شود)

### Backend:
- دامنه جدید را به `ALLOWED_ORIGINS` اضافه کنید

## 🎉 تمام!

سایت شما آماده است:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **Admin Panel**: `https://your-app.vercel.app/admin`

---

## 📚 مستندات بیشتر

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - راهنمای کامل
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - چک‌لیست
- [QUICK_START.md](QUICK_START.md) - راه‌اندازی local

## 🆘 کمک

اگر مشکلی داشتید:
1. لاگ‌ها را بررسی کنید
2. متغیرهای محیطی را بررسی کنید
3. CORS را بررسی کنید
4. مستندات را مطالعه کنید

**موفق باشید! 🚀**
