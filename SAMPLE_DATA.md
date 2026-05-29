# داده‌های نمونه برای تست

## افزودن محصولات نمونه

می‌توانید از طریق پنل ادمین محصولات اضافه کنید یا از API استفاده کنید:

### روش 1: از طریق پنل ادمین
1. وارد شوید با: `admin@shop.com` / `admin123`
2. برو به: پنل مدیریت → مدیریت محصولات
3. کلیک "+ افزودن محصول جدید"
4. پر کردن فرم

### روش 2: با cURL

```bash
# ابتدا login کنید و token بگیرید
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shop.com",
    "password": "admin123"
  }'

# Token را کپی کنید و در دستورات زیر جایگزین کنید
TOKEN="YOUR_TOKEN_HERE"

# محصول 1: کیف لپ‌تاپ
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "کیف لپ‌تاپ چرمی",
    "description": "کیف لپ‌تاپ چرمی با کیفیت بالا، مناسب برای لپ‌تاپ‌های 15 اینچی",
    "price": 450000,
    "stock": 15,
    "category": "bags",
    "image_url": "https://via.placeholder.com/300x300?text=Laptop+Bag"
  }'

# محصول 2: شارژر فست
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "شارژر فست 65 وات",
    "description": "شارژر سریع 65 وات با پورت USB-C و USB-A",
    "price": 280000,
    "stock": 25,
    "category": "chargers",
    "image_url": "https://via.placeholder.com/300x300?text=Fast+Charger"
  }'

# محصول 3: کابل Type-C
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "کابل Type-C به Type-C",
    "description": "کابل Type-C با طول 2 متر، پشتیبانی از شارژ سریع",
    "price": 85000,
    "stock": 50,
    "category": "cables",
    "image_url": "https://via.placeholder.com/300x300?text=USB-C+Cable"
  }'

# محصول 4: کاور گوشی
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "کاور سیلیکونی",
    "description": "کاور سیلیکونی با کیفیت، ضد ضربه و لغزش",
    "price": 120000,
    "stock": 30,
    "category": "cases",
    "image_url": "https://via.placeholder.com/300x300?text=Phone+Case"
  }'

# محصول 5: هدفون بلوتوث
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "هدفون بلوتوث ANC",
    "description": "هدفون بی‌سیم با قابلیت حذف نویز فعال، باتری 30 ساعته",
    "price": 1200000,
    "stock": 10,
    "category": "headphones",
    "image_url": "https://via.placeholder.com/300x300?text=Headphones"
  }'

# محصول 6: پاوربانک
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "پاوربانک 20000 میلی‌آمپر",
    "description": "پاوربانک با ظرفیت بالا، شارژ سریع 18 وات",
    "price": 350000,
    "stock": 20,
    "category": "others",
    "image_url": "https://via.placeholder.com/300x300?text=Power+Bank"
  }'
```

## تأیید محصولات

بعد از افزودن محصولات:

1. برو به: پنل مدیریت → مدیریت محصولات
2. روی دکمه "تأیید" کلیک کن
3. یادداشت کارشناسی بنویس (مثلاً: "محصول بررسی و تأیید شد")
4. کلیک "تأیید محصول"

## ایجاد کاربر نمونه

```bash
# ثبت‌نام کاربر عادی
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "علی احمدی",
    "email": "ali@example.com",
    "phone": "09123456789",
    "password": "123456"
  }'

# ثبت‌نام کارشناس
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "محمد رضایی",
    "email": "expert@example.com",
    "phone": "09121111111",
    "password": "123456"
  }'
```

سپس برای تبدیل به کارشناس، از پنل ادمین:
1. پنل مدیریت → مدیریت کاربران
2. نقش را به "کارشناس" تغییر دهید

## تست خرید

1. خروج از حساب ادمین
2. ثبت‌نام یا ورود با حساب مشتری
3. مشاهده محصولات تأیید شده
4. افزودن به سبد خرید
5. تکمیل خرید با آدرس تحویل

## پیگیری سفارش

بعد از خرید، کد رهگیری به شما داده می‌شود.
می‌توانید از صفحه "پیگیری سفارش" استفاده کنید.

## نکات

- محصولات تأیید نشده در صفحه اصلی نمایش داده نمی‌شوند
- فقط محصولات تأیید شده قابل خرید هستند
- ارسال رایگان برای خریدهای بالای 500,000 تومان
