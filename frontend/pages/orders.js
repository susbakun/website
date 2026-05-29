import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import styles from '@/styles/Orders.module.css';

export default function Orders() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/my-orders');
            setOrders(response.data.orders);
        } catch (error) {
            console.error('خطا در دریافت سفارشات:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
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

    if (loading) {
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
                <h1 className={styles.title}>سفارشات من</h1>

                {orders.length === 0 ? (
                    <div className={styles.empty}>
                        <p>شما هنوز سفارشی ثبت نکرده‌اید</p>
                        <button
                            onClick={() => router.push('/products')}
                            className="btn btn-primary"
                            style={{ marginTop: '20px' }}
                        >
                            مشاهده محصولات
                        </button>
                    </div>
                ) : (
                    <div className={styles.ordersList}>
                        {orders.map((order) => (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <div>
                                        <h3>سفارش #{order.id}</h3>
                                        <p className={styles.date}>
                                            {new Date(order.created_at).toLocaleDateString('fa-IR')}
                                        </p>
                                    </div>
                                    <span
                                        className={styles.status}
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                                </div>

                                <div className={styles.trackingCode}>
                                    <strong>کد رهگیری:</strong> {order.tracking_code}
                                </div>

                                <div className={styles.orderItems}>
                                    <h4>محصولات:</h4>
                                    {order.items && order.items.map((item, index) => (
                                        <div key={index} className={styles.item}>
                                            <span>{item.product_name}</span>
                                            <span>تعداد: {item.quantity}</span>
                                            <span>{formatPrice(item.price)} تومان</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.orderFooter}>
                                    <div className={styles.totalAmount}>
                                        <span>مبلغ کل:</span>
                                        <strong>
                                            {formatPrice(
                                                parseFloat(order.total_amount) + parseFloat(order.shipping_cost)
                                            )} تومان
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
