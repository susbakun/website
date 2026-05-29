import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Auth.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/');
        } catch (err) {
            setError(err.response?.data?.message || 'خطا در ورود');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <h1>ورود به حساب کاربری</h1>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>ایمیل</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>رمز عبور</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="رمز عبور خود را وارد کنید"
                            />
                        </div>

                        {error && <p className="error">{error}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', marginTop: '20px' }}
                        >
                            {loading ? 'در حال ورود...' : 'ورود'}
                        </button>
                    </form>

                    <p className={styles.authLink}>
                        حساب کاربری ندارید؟{' '}
                        <Link href="/register">ثبت‌نام کنید</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
}
