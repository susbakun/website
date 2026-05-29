import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Admin.module.css';

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

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
            alert('شما دسترسی به پنل ادمین ندارید');
            router.push('/');
        }
    }, [user, mounted]);

    if (!mounted || !user || (user.role !== 'admin' && user.role !== 'expert')) {
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
                <h1 className={styles.title}>پنل مدیریت</h1>

                <div className={styles.welcomeCard}>
                    <h2>خوش آمدید، {user.name}</h2>
                    <p>نقش: {user.role === 'admin' ? 'مدیر' : 'کارشناس'}</p>
                </div>

                <div className={styles.dashboardGrid}>
                    <Link href="/admin/products" className={styles.dashboardCard}>
                        <div className={styles.icon}>📦</div>
                        <h3>مدیریت محصولات</h3>
                        <p>افزودن، ویرایش و حذف محصولات</p>
                    </Link>

                    <Link href="/admin/verify" className={styles.dashboardCard}>
                        <div className={styles.icon}>✓</div>
                        <h3>تأیید محصولات</h3>
                        <p>بررسی و تأیید اصالت محصولات</p>
                    </Link>

                    <Link href="/admin/orders" className={styles.dashboardCard}>
                        <div className={styles.icon}>🛒</div>
                        <h3>مدیریت سفارشات</h3>
                        <p>مشاهده و مدیریت سفارشات</p>
                    </Link>

                    {user.role === 'admin' && (
                        <Link href="/admin/users" className={styles.dashboardCard}>
                            <div className={styles.icon}>👥</div>
                            <h3>مدیریت کاربران</h3>
                            <p>مشاهده و مدیریت کاربران</p>
                        </Link>
                    )}
                </div>
            </div>
        </Layout>
    );
}
