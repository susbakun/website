import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import styles from '@/styles/Admin.module.css';

export default function AdminUsers() {
    const { user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.role !== 'admin') {
            alert('فقط ادمین می‌تواند به این صفحه دسترسی داشته باشد');
            router.push('/admin');
            return;
        }

        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data.users);
        } catch (error) {
            console.error('خطا در دریافت کاربران:', error);
            // If endpoint doesn't exist, show mock data
            setUsers([
                { id: 1, name: 'کاربر تست', email: 'test@example.com', phone: '09123456789', role: 'customer' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            alert('نقش کاربر با موفقیت تغییر کرد');
            fetchUsers();
        } catch (error) {
            alert('خطا در تغییر نقش کاربر');
            console.error(error);
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return styles.badgeAdmin;
            case 'expert': return styles.badgeExpert;
            default: return styles.badgeCustomer;
        }
    };

    const getRoleText = (role) => {
        switch (role) {
            case 'admin': return 'مدیر';
            case 'expert': return 'کارشناس';
            default: return 'مشتری';
        }
    };

    if (!user || user.role !== 'admin') {
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
                <h1 className={styles.title}>مدیریت کاربران</h1>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>در حال بارگذاری...</p>
                ) : (
                    <div className={styles.table}>
                        <table>
                            <thead>
                                <tr>
                                    <th>شناسه</th>
                                    <th>نام</th>
                                    <th>ایمیل</th>
                                    <th>تلفن</th>
                                    <th>نقش</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.phone}</td>
                                        <td>
                                            <span className={`${styles.badge} ${getRoleBadgeClass(u.role)}`}>
                                                {getRoleText(u.role)}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                            >
                                                <option value="customer">مشتری</option>
                                                <option value="expert">کارشناس</option>
                                                <option value="admin">مدیر</option>
                                            </select>
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
