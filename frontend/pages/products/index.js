import { useState, useEffect } from 'react';
import Head from 'next/head';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import styles from '@/styles/Products.module.css';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [verifiedOnly, setVerifiedOnly] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [category, verifiedOnly]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = '/products';
            const params = [];

            if (category !== 'all') {
                params.push(`category=${category}`);
            }

            if (verifiedOnly) {
                params.push('verified=true');
            }

            if (params.length > 0) {
                url += '?' + params.join('&');
            }

            const response = await api.get(url);
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
                <title>محصولات - فروشگاه لوازم جانبی</title>
            </Head>

            <div className="container" style={{ padding: '40px 20px' }}>
                <h1 className={styles.title}>محصولات</h1>

                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label>دسته‌بندی:</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.select}
                        >
                            <option value="all">همه</option>
                            <option value="bags">کیف</option>
                            <option value="chargers">شارژر</option>
                            <option value="cables">کابل</option>
                            <option value="cases">کاور</option>
                            <option value="headphones">هدفون</option>
                            <option value="others">سایر</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <input
                            type="checkbox"
                            checked={verifiedOnly}
                            id='available'
                            onChange={(e) => setVerifiedOnly(e.target.checked)}
                        />
                        <label htmlFor='available' className={styles.checkboxLabel}>
                            فقط محصولات تأیید شده
                        </label>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loading}>در حال بارگذاری...</div>
                ) : products.length === 0 ? (
                    <div className={styles.empty}>
                        <p>محصولی یافت نشد</p>
                    </div>
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
