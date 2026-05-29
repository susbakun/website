import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import styles from './Layout.module.css';

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const { cart } = useCart();

    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className="container">
                    <nav className={styles.nav}>
                        <Link href="/" className={styles.logo}>
                            🛍️ فروشگاه لوازم جانبی
                        </Link>

                        <div className={styles.navLinks}>
                            <Link href="/products">محصولات</Link>
                            <Link href="/track-order">پیگیری سفارش</Link>

                            {user ? (
                                <>
                                    <Link href="/orders">سفارشات من</Link>
                                    {(user.role === 'admin' || user.role === 'expert') && (
                                        <Link href="/admin" style={{ color: '#667eea', fontWeight: 'bold' }}>
                                            پنل مدیریت
                                        </Link>
                                    )}
                                    <Link href="/cart" className={styles.cartLink}>
                                        🛒 سبد خرید
                                        {cartItemsCount > 0 && (
                                            <span className={styles.cartBadge}>{cartItemsCount}</span>
                                        )}
                                    </Link>
                                    <button onClick={logout} className={styles.logoutBtn}>
                                        خروج
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">ورود</Link>
                                    <Link href="/register" className="btn btn-primary">
                                        ثبت‌نام
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            <main className={styles.main}>{children}</main>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerContent}>
                        <div className={styles.footerSection}>
                            <h3>درباره ما</h3>
                            <p>فروشگاه لوازم جانبی با تضمین اصالت کالا</p>
                        </div>

                        <div className={styles.footerSection}>
                            <h3>خدمات مشتریان</h3>
                            <ul>
                                <li><Link href="/track-order">پیگیری سفارش</Link></li>
                                <li><Link href="/returns">بازگشت کالا</Link></li>
                                <li><Link href="/faq">سوالات متداول</Link></li>
                            </ul>
                        </div>

                        <div className={styles.footerSection}>
                            <h3>تماس با ما</h3>
                            <p>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
                            <p>ایمیل: info@shop.com</p>
                        </div>
                    </div>

                    <div className={styles.footerBottom}>
                        <p>&copy; ۱۴۰۵ تمامی حقوق محفوظ است</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
