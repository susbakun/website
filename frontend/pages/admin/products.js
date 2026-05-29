import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import styles from '@/styles/Admin.module.css';

export default function AdminProducts() {
    const { user } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'others',
        image_url: ''
    });

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.role !== 'admin' && user.role !== 'expert') {
            router.push('/');
            return;
        }

        fetchProducts();
    }, [user]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.products);
        } catch (error) {
            console.error('خطا در دریافت محصولات:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/products', formData);
            alert('محصول با موفقیت اضافه شد');
            setShowForm(false);
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                category: 'others',
                image_url: ''
            });
            fetchProducts();
        } catch (error) {
            alert('خطا در افزودن محصول');
            console.error(error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    if (!user || (user.role !== 'admin' && user.role !== 'expert')) {
        return (
            <Layout>
                <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <p>در حال بارگذاری...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container" style={{ padding: '40px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 className={styles.title}>مدیریت محصولات</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary"
                    >
                        {showForm ? 'لغو' : '+ افزودن محصول جدید'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <h2>افزودن محصول جدید</h2>

                        <div className={styles.formGroup}>
                            <label>نام محصول *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>توضیحات</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>قیمت (تومان) *</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>موجودی *</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>دسته‌بندی</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="bags">کیف</option>
                                <option value="chargers">شارژر</option>
                                <option value="cables">کابل</option>
                                <option value="cases">کاور</option>
                                <option value="headphones">هدفون</option>
                                <option value="others">سایر</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>آدرس تصویر</label>
                            <input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            افزودن محصول
                        </button>
                    </form>
                )}

                {loading ? (
                    <p style={{ textAlign: 'center' }}>در حال بارگذاری...</p>
                ) : (
                    <div className={styles.table}>
                        <table>
                            <thead>
                                <tr>
                                    <th>شناسه</th>
                                    <th>نام</th>
                                    <th>قیمت</th>
                                    <th>موجودی</th>
                                    <th>دسته‌بندی</th>
                                    <th>وضعیت</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{formatPrice(product.price)} تومان</td>
                                        <td>{product.stock}</td>
                                        <td>{product.category}</td>
                                        <td>
                                            {product.is_verified ? (
                                                <span className={`${styles.badge} ${styles.badgeVerified}`}>
                                                    تأیید شده
                                                </span>
                                            ) : (
                                                <span className={`${styles.badge} ${styles.badgePending}`}>
                                                    در انتظار تأیید
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                {!product.is_verified && (
                                                    <button
                                                        onClick={() => router.push(`/admin/verify/${product.id}`)}
                                                        className={styles.btnVerify}
                                                    >
                                                        تأیید
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}
