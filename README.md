# سایت فروش لوازم جانبی - MVP

## ویژگی‌های اصلی
- تضمین اصالت کالا با مهر تأیید کارشناسی قبل از ارسال
- سیاست اعتبارسنجی خریداران واقعی با کد رهگیری پستی
- ارسال رایگان برای سفارش‌های بالای مبلغ مشخص
- ضمانت بازگشت ۳۰ روزه وجه و تعویض کالا در محل
- **پنل مدیریت کامل برای ادمین و کارشناسان**

## تکنولوژی‌ها
- **Frontend**: Next.js
- **Backend**: Express.js
- **Database**: SQLite (بدون نیاز به نصب جداگانه)

## ساختار پروژه
```
/
├── frontend/          # Next.js application
├── backend/           # Express.js API
└── database/          # PostgreSQL schemas and migrations
```

## نصب و راه‌اندازی

### نصب سریع (5 دقیقه)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (در ترمینال جدید)
cd frontend
npm install
npm run dev
```

**ادمین پیش‌فرض:**
- Email: `admin@shop.com`
- Password: `admin123`

برای راهنمای کامل، [QUICK_START.md](QUICK_START.md) را ببینید.

## متغیرهای محیطی
فایل‌های `.env.example` را در هر دایرکتری کپی کرده و به `.env` تغییر نام دهید.

## پنل مدیریت
برای اطلاعات کامل درباره پنل ادمین، فایل [ADMIN_PANEL.md](ADMIN_PANEL.md) را مطالعه کنید.

**دسترسی:** `/admin`  
**نقش‌های مجاز:** Admin, Expert
