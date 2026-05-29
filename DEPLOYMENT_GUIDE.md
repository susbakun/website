# راهنمای استقرار پروژه روی Vercel

این پروژه شامل دو بخش است که باید جداگانه مستقر شوند:
- **Frontend (Next.js)**: روی Vercel
- **Backend (Express.js)**: روی سرویس دیگری (Railway, Render, یا Vercel Serverless)

## گزینه 1: استقرار Frontend روی Vercel + Backend روی Railway (توصیه می‌شود)

### مرحله 1: استقرار Backend روی Railway

1. به [Railway.app](https://railway.app) بروید و ثبت‌نام کنید
2. پروژه جدید ایجاد کنید
3. "Deploy from GitHub repo" را انتخاب کنید
4. مخزن خود را متصل کنید
5. Root Directory را به `backend` تنظیم کنید
6. متغیرهای محیطی را اضافه کنید:
   ```
   PORT=5001
   NODE_ENV=production
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_EXPIRE=7d
   FREE_SHIPPING_THRESHOLD=500000
   ```
7. دستور Start را تنظیم کنید: `npm start`
8. پس از استقرار، URL بکند خود را کپی کنید (مثلاً: `https://your-app.railway.app`)

### مرحله 2: استقرار Frontend روی Vercel

#### روش A: از طریق Vercel CLI (سریع‌تر)

1. Vercel CLI را نصب کنید:
   ```bash
   npm install -g vercel
   ```

2. وارد دایرکتری پروژه شوید:
   ```bash
   cd /Users/amir/Nextjs-Projects/website
   ```

3. دستور vercel را اجرا کنید:
   ```bash
   vercel
   ```

4. سوالات را پاسخ دهید:
   - Set up and deploy? **Y**
   - Which scope? (حساب خود را انتخاب کنید)
   - Link to existing project? **N**
   - Project name? **accessories-shop** (یا نام دلخواه)
   - In which directory is your code located? **./frontend**

5. متغیرهای محیطی را اضافه کنید:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   ```
   مقدار: `https://your-backend-url.railway.app/api`
   
   ```bash
   vercel env add NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD
   ```
   مقدار: `500000`

6. دوباره deploy کنید:
   ```bash
   vercel --prod
   ```

#### روش B: از طریق Vercel Dashboard

1. به [vercel.com](https://vercel.com) بروید و وارد شوید
2. "Add New Project" را کلیک کنید
3. مخزن GitHub خود را متصل کنید
4. تنظیمات پروژه:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. متغیرهای محیطی را اضافه کنید:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.railway.app/api`
   - `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD`: `500000`

6. "Deploy" را کلیک کنید

### مرحله 3: تنظیمات نهایی

1. **CORS را در Backend تنظیم کنید**: فایل `backend/src/server.js` را ویرایش کنید و دامنه Vercel را اضافه کنید:
   ```javascript
   app.use(cors({
     origin: ['https://your-vercel-domain.vercel.app', 'http://localhost:3000'],
     credentials: true
   }));
   ```

2. **دیتابیس را Seed کنید** (در Railway):
   ```bash
   npm run seed
   ```

---

## گزینه 2: استقرار کامل روی Vercel (Backend به صورت Serverless)

اگر می‌خواهید همه چیز روی Vercel باشد، باید Backend را به Serverless Functions تبدیل کنید.

### تبدیل Backend به Vercel Serverless Functions

1. ساختار جدید ایجاد کنید:
   ```
   /api
     /auth.js
     /products.js
     /orders.js
     /verification.js
     /users.js
   ```

2. هر route را به یک serverless function تبدیل کنید

3. فایل `vercel.json` در root پروژه:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "frontend/package.json",
         "use": "@vercel/next"
       },
       {
         "src": "api/**/*.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/api/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/frontend/$1"
       }
     ]
   }
   ```

**نکته**: این روش پیچیده‌تر است و نیاز به بازنویسی کد Backend دارد.

---

## گزینه 3: Backend روی Render.com

مشابه Railway، اما رایگان:

1. به [Render.com](https://render.com) بروید
2. "New Web Service" را انتخاب کنید
3. مخزن GitHub را متصل کنید
4. تنظیمات:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. متغیرهای محیطی را اضافه کنید
6. Deploy کنید

---

## بررسی استقرار

پس از استقرار، موارد زیر را بررسی کنید:

✅ Frontend در دسترس است  
✅ Backend health check کار می‌کند: `https://your-backend-url/health`  
✅ ورود به سیستم کار می‌کند  
✅ محصولات نمایش داده می‌شوند  
✅ سفارش‌گذاری کار می‌کند  
✅ پنل ادمین در دسترس است  

---

## نکات امنیتی

⚠️ **قبل از استقرار production:**

1. JWT_SECRET را تغییر دهید (از یک رشته تصادفی قوی استفاده کنید)
2. رمز عبور ادمین پیش‌فرض را تغییر دهید
3. CORS را فقط برای دامنه‌های مجاز تنظیم کنید
4. NODE_ENV را به `production` تنظیم کنید
5. فایل‌های `.env` را به `.gitignore` اضافه کنید (قبلاً اضافه شده)

---

## پشتیبانی

اگر مشکلی داشتید:
- لاگ‌های Vercel را بررسی کنید
- لاگ‌های Railway/Render را بررسی کنید
- مطمئن شوید متغیرهای محیطی صحیح تنظیم شده‌اند
- CORS را بررسی کنید
