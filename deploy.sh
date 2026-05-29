#!/bin/bash

# رنگ‌ها برای خروجی
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 راهنمای استقرار پروژه${NC}\n"

# بررسی نصب Vercel CLI
if ! command -v vercel &> /dev/null
then
    echo -e "${YELLOW}⚠️  Vercel CLI نصب نیست${NC}"
    echo -e "${BLUE}آیا می‌خواهید نصب کنید؟ (y/n)${NC}"
    read -r install_vercel
    if [ "$install_vercel" = "y" ]; then
        npm install -g vercel
        echo -e "${GREEN}✅ Vercel CLI نصب شد${NC}\n"
    else
        echo -e "${RED}❌ برای استقرار به Vercel CLI نیاز دارید${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}انتخاب کنید:${NC}"
echo "1) استقرار Frontend روی Vercel"
echo "2) نمایش راهنمای استقرار Backend"
echo "3) بررسی وضعیت پروژه"
echo "4) خروج"
echo ""
read -p "انتخاب شما (1-4): " choice

case $choice in
    1)
        echo -e "\n${BLUE}📦 استقرار Frontend روی Vercel...${NC}\n"
        
        # بررسی وجود فایل .env.local
        if [ ! -f "frontend/.env.local" ]; then
            echo -e "${YELLOW}⚠️  فایل frontend/.env.local وجود ندارد${NC}"
            echo -e "${BLUE}آیا می‌خواهید از .env.local.example کپی کنید؟ (y/n)${NC}"
            read -r copy_env
            if [ "$copy_env" = "y" ]; then
                cp frontend/.env.local.example frontend/.env.local
                echo -e "${GREEN}✅ فایل .env.local ایجاد شد${NC}"
                echo -e "${YELLOW}⚠️  لطفاً URL بکند خود را در این فایل تنظیم کنید${NC}\n"
            fi
        fi
        
        echo -e "${BLUE}آیا URL بکند خود را دارید؟ (y/n)${NC}"
        read -r has_backend
        
        if [ "$has_backend" = "y" ]; then
            read -p "URL بکند را وارد کنید (مثال: https://your-app.railway.app): " backend_url
            
            echo -e "\n${BLUE}در حال استقرار...${NC}\n"
            cd frontend
            vercel --prod \
                -e NEXT_PUBLIC_API_URL="$backend_url/api" \
                -e NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD="500000"
            cd ..
            
            echo -e "\n${GREEN}✅ استقرار کامل شد!${NC}"
        else
            echo -e "\n${YELLOW}⚠️  ابتدا باید Backend را مستقر کنید${NC}"
            echo -e "${BLUE}راهنمای استقرار Backend را مطالعه کنید: DEPLOYMENT_GUIDE.md${NC}\n"
        fi
        ;;
        
    2)
        echo -e "\n${BLUE}📚 راهنمای استقرار Backend${NC}\n"
        echo -e "${YELLOW}گزینه 1: Railway (توصیه می‌شود)${NC}"
        echo "1. به https://railway.app بروید"
        echo "2. 'New Project' → 'Deploy from GitHub repo'"
        echo "3. Root Directory: backend"
        echo "4. متغیرهای محیطی را اضافه کنید (مطابق DEPLOYMENT_GUIDE.md)"
        echo "5. Deploy کنید"
        echo ""
        echo -e "${YELLOW}گزینه 2: Render${NC}"
        echo "1. به https://render.com بروید"
        echo "2. 'New Web Service'"
        echo "3. Root Directory: backend"
        echo "4. Build Command: npm install"
        echo "5. Start Command: npm start"
        echo ""
        echo -e "${BLUE}برای جزئیات بیشتر: DEPLOYMENT_GUIDE.md${NC}\n"
        ;;
        
    3)
        echo -e "\n${BLUE}🔍 بررسی وضعیت پروژه...${NC}\n"
        
        # بررسی فایل‌های ضروری
        echo -e "${BLUE}فایل‌های پیکربندی:${NC}"
        [ -f "vercel.json" ] && echo -e "${GREEN}✅ vercel.json${NC}" || echo -e "${RED}❌ vercel.json${NC}"
        [ -f "frontend/.env.local" ] && echo -e "${GREEN}✅ frontend/.env.local${NC}" || echo -e "${YELLOW}⚠️  frontend/.env.local (اختیاری برای local)${NC}"
        [ -f "backend/.env" ] && echo -e "${GREEN}✅ backend/.env${NC}" || echo -e "${YELLOW}⚠️  backend/.env (اختیاری برای local)${NC}"
        
        echo ""
        echo -e "${BLUE}وابستگی‌ها:${NC}"
        [ -d "frontend/node_modules" ] && echo -e "${GREEN}✅ Frontend dependencies${NC}" || echo -e "${RED}❌ Frontend dependencies (npm install در frontend)${NC}"
        [ -d "backend/node_modules" ] && echo -e "${GREEN}✅ Backend dependencies${NC}" || echo -e "${RED}❌ Backend dependencies (npm install در backend)${NC}"
        
        echo ""
        echo -e "${BLUE}Git:${NC}"
        if git rev-parse --git-dir > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Git repository${NC}"
            
            # بررسی remote
            if git remote -v | grep -q "origin"; then
                echo -e "${GREEN}✅ Git remote configured${NC}"
                git remote -v | head -2
            else
                echo -e "${YELLOW}⚠️  Git remote تنظیم نشده${NC}"
            fi
        else
            echo -e "${RED}❌ Git repository (git init کنید)${NC}"
        fi
        
        echo ""
        ;;
        
    4)
        echo -e "${BLUE}خداحافظ!${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}انتخاب نامعتبر${NC}"
        exit 1
        ;;
esac

echo -e "\n${BLUE}📖 مستندات:${NC}"
echo "- راهنمای کامل: DEPLOYMENT_GUIDE.md"
echo "- چک‌لیست: DEPLOYMENT_CHECKLIST.md"
echo ""
