import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import styles from '@/styles/Admin.module.css';

export default function AdminOrders() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.role !== 'admin' && user.role !== 'expert') {
            router.push('/');
            return;
        }

        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/all');
            setOrders(response.data.orders);
        } catch (error) {
            console.error('خطا در دریافت سفارشات:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            alert('وضعیت سفارش با موفقیت تغییر کرد');
            fetchOrders();
        } catch (error) {
            alert('خطا در تغییر وضعیت سفارش');
            console.error(error);
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
                <h1 className={styles.title}>مدیریت سفارشات</h1>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>در حال بارگذاری...</p>
                ) : orders.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>سفارشی یافت نشد</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {orders.map((order) => (
                            <div key={order.id} className={styles.form} style={{ maxWidth: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 10px 0' }}>سفارش #{order.id}</h3>
                                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                            <strong>مشتری:</strong> {order.user_name} ({order.user_email})
                                        </p>
                                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                            <strong>کد رهگیری:</strong> {order.tracking_code}
                                        </p>
                                        <p style={{ margin: '0', color: '#666' }}>
                                            <strong>تاریخ:</strong> {new Date(order.created_at).toLocaleDateString('fa-IR')}
                                        </p>
                                    </div>

                                    <div style={{ textAlign: 'left' }}>
                                        <span
                                            className={styles.badge}
                                            style={{
                                                backgroundColor: getStatusColor(order.status),
                                                color: 'white',
                                                padding: '8px 16px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                                    <h4 style={{ margin: '0 0 10px 0' }}>محصولات:</h4>
                                    {order.items && order.items.map((item, index) => (
                                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: index < order.items.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                                            <span>{item.product_name}</span>
                                            <span>تعداد: {item.quantity}</span>
                                            <span>{formatPrice(item.price)} تومان</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '2px solid #e0e0e0' }}>
                                    <div>
                                        <strong style={{ fontSize: '18px', color: '#667eea' }}>
                                            مبلغ کل: {formatPrice(parseFloat(order.total_amount) + parseFloat(order.shipping_cost))} تومان
                                        </strong>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <label style={{ fontWeight: '500' }}>تغییر وضعیت:</label>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' }}
                                        >
                                            <option value="pending">در انتظار پردازش</option>
                                            <option value="processing">در حال پردازش</option>
                                            <option value="shipped">ارسال شده</option>
                                            <option value="delivered">تحویل داده شده</option>
                                            <option value="cancelled">لغو شده</option>
                                        </select>
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
