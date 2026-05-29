import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import styles from '@/styles/Cart.module.css';

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, getTotal, getShippingCost, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [shippingAddress, setShippingAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const total = getTotal();
    const shippingCost = getShippingCost();
    const finalTotal = total + shippingCost;

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (!user) {
            router.push('/login');
            return;
        }

        if (cart.length === 0) {
            setError('سبد خرید خالی است');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const items = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }));

            const response = await api.post('/orders', {
                items,
                shipping_address: shippingAddress
            });

            clearCart();
            alert(`سفارش با موفقیت ثبت شد. کد رهگیری: ${response.data.order.tracking_code}`);
            router.push('/orders');
        } catch (err) {
            setError(err.response?.data?.message || 'خطا در ثبت سفارش');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <Layout>
                <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <h1>سبد خرید شما خالی است</h1>
                    <button
                        onClick={() => router.push('/products')}
                        className="btn btn-primary"
                        style={{ marginTop: '20px' }}
                    >
                        مشاهده محصولات
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container" style={{ padding: '40px 20px' }}>
                <h1 className={styles.title}>سبد خرید</h1>

                <div className={styles.cartContainer}>
                    <div className={styles.cartItems}>
                        {cart.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.itemInfo}>
                                    <h3>{item.name}</h3>
                                    <p className={styles.itemPrice}>
                                        {formatPrice(item.price)} تومان
                                    </p>
                                </div>

                                <div className={styles.itemActions}>
                                    <div className={styles.quantityControl}>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            +
                                        </button>
                                    </div>

                                    <div className={styles.itemTotal}>
                                        {formatPrice(item.price * item.quantity)} تومان
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className={styles.removeBtn}
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.checkoutSection}>
                        <div className={styles.summary}>
                            <h2>خلاصه سفارش</h2>

                            <div className={styles.summaryRow}>
                                <span>جمع کل:</span>
                                <span>{formatPrice(total)} تومان</span>
                            </div>

                            <div className={styles.summaryRow}>
                                <span>هزینه ارسال:</span>
                                <span>
                                    {shippingCost === 0 ? (
                                        <span className={styles.freeShipping}>رایگان</span>
                                    ) : (
                                        `${formatPrice(shippingCost)} تومان`
                                    )}
                                </span>
                            </div>

                            <div className={styles.summaryTotal}>
                                <span>مبلغ قابل پرداخت:</span>
                                <span>{formatPrice(finalTotal)} تومان</span>
                            </div>
                        </div>

                        <form onSubmit={handleCheckout} className={styles.checkoutForm}>
                            <h3>آدرس تحویل</h3>
                            <textarea
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="آدرس کامل خود را وارد کنید"
                                required
                                rows={4}
                            />

                            {error && <p className="error">{error}</p>}

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ width: '100%' }}
                            >
                                {loading ? 'در حال ثبت...' : 'تکمیل خرید'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
