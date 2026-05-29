const db = require('./config/database');

console.log('🌱 Seeding database with sample data...');

// Sample products
const products = [
    {
        name: 'کیف لپ‌تاپ چرمی',
        description: 'کیف لپ‌تاپ چرمی با کیفیت بالا، مناسب برای لپ‌تاپ‌های 15 اینچی',
        price: 450000,
        stock: 15,
        category: 'bags',
        image_url: 'https://via.placeholder.com/300x300?text=Laptop+Bag'
    },
    {
        name: 'شارژر فست 65 وات',
        description: 'شارژر سریع 65 وات با پورت USB-C و USB-A',
        price: 280000,
        stock: 25,
        category: 'chargers',
        image_url: 'https://via.placeholder.com/300x300?text=Fast+Charger'
    },
    {
        name: 'کابل Type-C به Type-C',
        description: 'کابل Type-C با طول 2 متر، پشتیبانی از شارژ سریع',
        price: 85000,
        stock: 50,
        category: 'cables',
        image_url: 'https://via.placeholder.com/300x300?text=USB-C+Cable'
    },
    {
        name: 'کاور سیلیکونی',
        description: 'کاور سیلیکونی با کیفیت، ضد ضربه و لغزش',
        price: 120000,
        stock: 30,
        category: 'cases',
        image_url: 'https://via.placeholder.com/300x300?text=Phone+Case'
    },
    {
        name: 'هدفون بلوتوث ANC',
        description: 'هدفون بی‌سیم با قابلیت حذف نویز فعال، باتری 30 ساعته',
        price: 1200000,
        stock: 10,
        category: 'headphones',
        image_url: 'https://via.placeholder.com/300x300?text=Headphones'
    },
    {
        name: 'پاوربانک 20000 میلی‌آمپر',
        description: 'پاوربانک با ظرفیت بالا، شارژ سریع 18 وات',
        price: 350000,
        stock: 20,
        category: 'others',
        image_url: 'https://via.placeholder.com/300x300?text=Power+Bank'
    }
];

try {
    // Check if products already exist
    const existingProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();

    if (existingProducts.count > 0) {
        console.log('⚠️  Products already exist. Skipping seed.');
        console.log(`   Current products count: ${existingProducts.count}`);
        process.exit(0);
    }

    // Insert products
    const insertProduct = db.prepare(`
    INSERT INTO products (name, description, price, stock, category, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    for (const product of products) {
        insertProduct.run(
            product.name,
            product.description,
            product.price,
            product.stock,
            product.category,
            product.image_url
        );
    }

    console.log(`✅ Successfully added ${products.length} sample products`);
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Login as admin: admin@shop.com / admin123');
    console.log('   2. Go to Admin Panel → Product Management');
    console.log('   3. Verify the products to make them visible');
    console.log('');

} catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
}
