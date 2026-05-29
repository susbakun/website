import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import styles from '@/styles/Home.module.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products?verified=true');
            setProducts(response.data.products);
        } catch (error) {
            console.error('خطا در دریافت محصولات:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Head>
                <title>فروشگاه لوازم جانبی</title>
                <meta name="description" content="خرید لوازم جانبی با ضمانت اصالت" />
            </Head>

            <div className={styles.hero}>
                <div className="container">
                    <h1>فروشگاه لوازم جانبی</h1>
                    <p className={styles.subtitle}>خرید با اطمینان، تضمین اصالت کالا</p>

                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.icon}>✓</span>
                            <h3>تضمین اصالت کالا</h3>
                            <p>با مهر تأیید کارشناسی قبل از ارسال</p>
                        </div>

                        <div className={styles.feature}>
                            <span className={styles.icon}>📦</span>
                            <h3>ارسال رایگان</h3>
                            <p>برای سفارش‌های بالای ۵۰۰ هزار تومان</p>
                        </div>

                        <div className={styles.feature}>
                            <span className={styles.icon}>🔄</span>
                            <h3>ضمانت بازگشت</h3>
                            <p>۳۰ روزه وجه و تعویض کالا در محل</p>
                        </div>

                        <div className={styles.feature}>
                            <span className={styles.icon}>🚚</span>
                            <h3>کد رهگیری پستی</h3>
                            <p>پیگیری آنلاین سفارش شما</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <h2 className={styles.sectionTitle}>محصولات تأیید شده</h2>

                {loading ? (
                    <p>در حال بارگذاری...</p>
                ) : (
                    <div className={styles.productsGrid}>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
