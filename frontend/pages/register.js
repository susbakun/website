import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import styles from '@/styles/Auth.module.css';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('رمز عبور و تکرار آن مطابقت ندارند');
            return;
        }

        if (formData.password.length < 6) {
            setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
            return;
        }

        setLoading(true);

        try {
            await register(formData.name, formData.email, formData.phone, formData.password);
            router.push('/');
        } catch (err) {
            setError(err.response?.data?.message || 'خطا در ثبت‌نام');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <h1>ثبت‌نام</h1>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>نام و نام خانوادگی</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="نام خود را وارد کنید"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>ایمیل</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>شماره تلفن</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="09123456789"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>رمز عبور</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="حداقل ۶ کاراکتر"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>تکرار رمز عبور</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="رمز عبور را دوباره وارد کنید"
                            />
                        </div>

                        {error && <p className="error">{error}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', marginTop: '20px' }}
                        >
                            {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                        </button>
                    </form>

                    <p className={styles.authLink}>
                        قبلاً ثبت‌نام کرده‌اید؟{' '}
                        <Link href="/login">وارد شوید</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
}
