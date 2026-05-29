import { useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import styles from '@/styles/TrackOrder.module.css';

export default function TrackOrder() {
    const [trackingCode, setTrackingCode] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setOrder(null);
        setLoading(true);

        try {
            const response = await api.get(`/orders/track/${trackingCode}`);
            setOrder(response.data.order);
        } catch (err) {
            setError(err.response?.data?.message || 'سفارش یافت نشد');
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            pending: 'در انتظار پردازش',
            processing: 'در حال پردازش',
            shipped: 'ارسال شده',
            delivered: 'تحویل داده شده',
            cancelled: 'لغو شده',
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status) => {
        const colorMap = {
            pending: '#f59e0b',
            processing: '#3b82f6',
            shipped: '#8b5cf6',
            delivered: '#10b981',
            cancelled: '#ef4444',
        };
        return colorMap[status] || '#6b7280';
    };

    return (
        <Layout>
            <div className="container" style={{ padding: '40px 20px' }}>
                <h1 className={styles.title}>پیگیری سفارش</h1>

                <div className={styles.trackCard}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>کد رهگیری</label>
                            <input
                                type="text"
                                value={trackingCode}
                                onChange={(e) => setTrackingCode(e.target.value)}
                                placeholder="کد رهگیری خود را وارد کنید"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'در حال جستجو...' : 'پیگیری سفارش'}
                        </button>
                    </form>

                    {error && <p className="error" style={{ marginTop: '20px' }}>{error}</p>}

                    {order && (
                        <div className={styles.orderInfo}>
                            <h2>اطلاعات سفارش</h2>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>شماره سفارش:</span>
                                <span className={styles.value}>{order.id}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>کد رهگیری:</span>
                                <span className={styles.value}>{order.tracking_code}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>وضعیت:</span>
                                <span
                                    className={styles.status}
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {getStatusText(order.status)}
                                </span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>تاریخ ثبت:</span>
                                <span className={styles.value}>
                                    {new Date(order.created_at).toLocaleDateString('fa-IR')}
                                </span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.label}>آخرین بروزرسانی:</span>
                                <span className={styles.value}>
                                    {new Date(order.updated_at).toLocaleDateString('fa-IR')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
