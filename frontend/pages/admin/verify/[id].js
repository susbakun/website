import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import styles from '@/styles/Admin.module.css';

export default function VerifyProduct() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        verification_notes: '',
        verification_seal: ''
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!user) {
            router.push('/login');
            return;
        }

        if (user.role !== 'admin' && user.role !== 'expert') {
            router.push('/');
            return;
        }

        if (id) {
            fetchProduct();
        }
    }, [user, id, mounted]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data.product);

            // Generate seal
            setFormData({
                ...formData,
                verification_seal: `SEAL-${Date.now()}-${id}`
            });
        } catch (error) {
            console.error('خطا در دریافت محصول:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post(`/verification/product/${id}`, formData);
            alert('محصول با موفقیت تأیید شد');
            router.push('/admin/products');
        } catch (error) {
            alert('خطا در تأیید محصول');
            console.error(error);
        }
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

    if (loading) {
        return (
            <Layout>
                <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <p>در حال بارگذاری...</p>
                </div>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout>
                <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <h1>محصول یافت نشد</h1>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container" style={{ padding: '40px 20px' }}>
                <h1 className={styles.title}>تأیید محصول</h1>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className={styles.form} style={{ maxWidth: '100%' }}>
                        <h2>اطلاعات محصول</h2>
                        <p><strong>نام:</strong> {product.name}</p>
                        <p><strong>توضیحات:</strong> {product.description}</p>
                        <p><strong>قیمت:</strong> {new Intl.NumberFormat('fa-IR').format(product.price)} تومان</p>
                        <p><strong>موجودی:</strong> {product.stock}</p>
                        <p><strong>دسته‌بندی:</strong> {product.category}</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form} style={{ maxWidth: '100%' }}>
                        <h2>تأیید اصالت</h2>

                        <div className={styles.formGroup}>
                            <label>یادداشت کارشناسی *</label>
                            <textarea
                                value={formData.verification_notes}
                                onChange={(e) => setFormData({ ...formData, verification_notes: e.target.value })}
                                placeholder="محصول بررسی شد و اصالت آن تأیید گردید..."
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>مهر تأیید</label>
                            <input
                                type="text"
                                value={formData.verification_seal}
                                readOnly
                                style={{ background: '#f5f5f5' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                type="button"
                                onClick={() => router.push('/admin/products')}
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                            >
                                انصراف
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                            >
                                تأیید محصول
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
