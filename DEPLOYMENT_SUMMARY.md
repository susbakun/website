# 📋 خلاصه استقرار پروژه

## ✅ فایل‌های ایجاد شده

من فایل‌های زیر را برای کمک به استقرار پروژه شما ایجاد کردم:

### 📄 فایل‌های پیکربندی
- **`vercel.json`** - پیکربندی Vercel برای Frontend
- **`.vercelignore`** - فایل‌هایی که نباید به Vercel ارسال شوند
- **`railway.toml`** - پیکربندی Railway برای Backend
- **`.gitignore`** - فایل‌هایی که نباید در Git باشند

### 📚 مستندات
- **`QUICK_DEPLOY.md`** ⭐ - **شروع از اینجا!** راهنمای سریع 5 دقیقه‌ای
- **`DEPLOYMENT_GUIDE.md`** - راهنمای کامل و جزئیات
- **`DEPLOYMENT_CHECKLIST.md`** - چک‌لیست گام به گام
- **`DEPLOYMENT_SUMMARY.md`** - این فایل!

### 🛠️ اسکریپت‌ها
- **`deploy.sh`** - اسکریپت کمکی برای استقرار (اختیاری)

### 🔧 تغییرات کد
- **`backend/src/server.js`** - اضافه شدن پشتیبانی CORS برای production
- **`backend/.env.example`** - اضافه شدن `ALLOWED_ORIGINS`

---

## 🚀 چگونه شروع کنم؟

### گزینه 1: راهنمای سریع (توصیه می‌شود)
```bash
# فایل QUICK_DEPLOY.md را باز کنید
open QUICK_DEPLOY.md
```
این راهنما شما را در 5 دقیقه به استقرار می‌رساند.

### گزینه 2: استفاده از اسکریپت
```bash
# اجرای اسکریپت کمکی
./deploy.sh
```

### گزینه 3: دستی
1. `DEPLOYMENT_CHECKLIST.md` را باز کنید
2. مرحله به مرحله پیش بروید

---

## 📊 معماری استقرار

```
┌─────────────────────────────────────────────────────────┐
│                        کاربران                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Frontend (Next.js)                          │
│              🌐 Vercel                                   │
│              https://your-app.vercel.app                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Express.js)                        │
│              🚂 Railway / Render                         │
│              https://your-app.railway.app                │
│              ├── SQLite Database                         │
│              └── REST API                                │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 مراحل استقرار (خلاصه)

### 1️⃣ آماده‌سازی (2 دقیقه)
```bash
# Git را مقداردهی اولیه کنید
git init
git add .
git commit -m "Initial commit"

# به GitHub push کنید
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2️⃣ Backend - Railway (2 دقیقه)
1. به [railway.app](https://railway.app) بروید
2. "Deploy from GitHub repo"
3. Root Directory: `backend`
4. متغیرهای محیطی را اضافه کنید
5. URL را کپی کنید

### 3️⃣ Frontend - Vercel (1 دقیقه)
```bash
npm install -g vercel
vercel
# یا از dashboard استفاده کنید
```

### 4️⃣ تنظیمات نهایی (30 ثانیه)
- CORS را در Backend به‌روز کنید
- سایت را تست کنید

---

## 🔑 متغیرهای محیطی مورد نیاز

### Backend (Railway/Render)
```env
PORT=5001
NODE_ENV=production
JWT_SECRET=<رشته_تصادفی_32_کاراکتری>
JWT_EXPIRE=7d
FREE_SHIPPING_THRESHOLD=500000
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3000
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=500000
```

---

## 🧪 تست استقرار

بعد از استقرار، این موارد را بررسی کنید:

✅ صفحه اصلی لود می‌شود  
✅ محصولات نمایش داده می‌شوند  
✅ ورود به سیستم کار می‌کند (admin@shop.com / admin123)  
✅ پنل ادمین در دسترس است (/admin)  
✅ سبد خرید کار می‌کند  
✅ سفارش‌گذاری کار می‌کند  

---

## 🐛 رفع مشکلات رایج

### مشکل: محصولات نمایش داده نمی‌شوند
**راه‌حل:**
1. Console مرورگر را باز کنید (F12)
2. خطای CORS؟ → `ALLOWED_ORIGINS` را بررسی کنید
3. خطای Network؟ → `NEXT_PUBLIC_API_URL` را بررسی کنید

### مشکل: خطای 500 در Backend
**راه‌حل:**
1. لاگ‌های Railway/Render را بررسی کنید
2. متغیرهای محیطی را بررسی کنید
3. دیتابیس را seed کنید

### مشکل: صفحه سفید
**راه‌حل:**
1. لاگ‌های Vercel را بررسی کنید
2. Root Directory = `frontend` باشد
3. در local تست کنید: `cd frontend && npm run build`

---

## 💰 هزینه‌ها

### رایگان:
- **Vercel**: 100GB bandwidth/ماه
- **Railway**: $5 اعتبار رایگان/ماه (کافی برای شروع)
- **Render**: 750 ساعت رایگان/ماه

### برای ترافیک بالا:
- Vercel Pro: $20/ماه
- Railway: Pay as you go
- Render: $7/ماه

---

## 🔒 نکات امنیتی

⚠️ **قبل از استفاده واقعی:**

1. JWT_SECRET قوی تولید کنید:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. رمز عبور ادمین را تغییر دهید

3. CORS را محدود کنید (فقط دامنه‌های مجاز)

4. HTTPS را فعال کنید (پیش‌فرض در Vercel و Railway)

---

## 📞 پشتیبانی

### مستندات:
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Next.js Docs](https://nextjs.org/docs)

### لاگ‌ها:
- **Vercel**: Dashboard → Deployments → لاگ‌ها
- **Railway**: Dashboard → Deployments → View Logs

---

## 🎉 مرحله بعدی

پس از استقرار موفق:

1. **دامنه سفارشی** اضافه کنید
2. **Analytics** را فعال کنید (Vercel Analytics)
3. **Monitoring** را راه‌اندازی کنید
4. **Backup** از دیتابیس بگیرید
5. **CI/CD** را تنظیم کنید (خودکار است!)

---

## 📁 ساختار فایل‌های استقرار

```
/
├── vercel.json              # پیکربندی Vercel
├── .vercelignore            # فایل‌های نادیده گرفته شده
├── railway.toml             # پیکربندی Railway
├── .gitignore               # فایل‌های Git
├── deploy.sh                # اسکریپت کمکی
├── QUICK_DEPLOY.md          # ⭐ شروع از اینجا
├── DEPLOYMENT_GUIDE.md      # راهنمای کامل
├── DEPLOYMENT_CHECKLIST.md  # چک‌لیست
└── DEPLOYMENT_SUMMARY.md    # این فایل
```

---

## ✨ نکات و ترفندها

### استقرار خودکار
هر بار که به GitHub push می‌کنید، Vercel و Railway به صورت خودکار deploy می‌کنند!

### Preview Deployments
Vercel برای هر Pull Request یک preview deployment ایجاد می‌کند.

### Environment Variables
می‌توانید متغیرهای محیطی مختلف برای Development, Preview, و Production داشته باشید.

### Custom Domains
می‌توانید دامنه سفارشی خود را به Vercel و Railway متصل کنید.

---

**موفق باشید! 🚀**

اگر سوالی دارید، مستندات را مطالعه کنید یا از من بپرسید.
