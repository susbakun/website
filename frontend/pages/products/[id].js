import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import styles from '@/styles/ProductDetail.module.css';

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data.product);
        } catch (error) {
            console.error('خطا در دریافت محصول:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert('محصول به سبد خرید اضافه شد');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
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

    if (!product) {
        return (
            <Layout>
                <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <h1>محصول یافت نشد</h1>
                    <button onClick={() => router.push('/products')} className="btn btn-primary">
                        بازگشت به محصولات
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head>
                <title>{product.name} - فروشگاه لوازم جانبی</title>
            </Head>

            <div className="container" style={{ padding: '40px 20px' }}>
                <div className={styles.productDetail}>
                    <div className={styles.imageSection}>
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.name} />
                        ) : (
                            <div className={styles.noImage}>بدون تصویر</div>
                        )}
                    </div>

                    <div className={styles.infoSection}>
                        <h1 className={styles.title}>{product.name}</h1>

                        {product.is_verified && (
                            <div className={styles.verifiedBadge}>
                                ✓ تأیید شده توسط کارشناس
                                {product.verified_by_name && (
                                    <span className={styles.expertName}> - {product.verified_by_name}</span>
                                )}
                            </div>
                        )}

                        <div className={styles.price}>
                            {formatPrice(product.price)} تومان
                        </div>

                        <div className={styles.stock}>
                            {product.stock > 0 ? (
                                <span className={styles.inStock}>موجود ({product.stock} عدد)</span>
                            ) : (
                                <span className={styles.outOfStock}>ناموجود</span>
                            )}
                        </div>

                        <div className={styles.description}>
                            <h3>توضیحات</h3>
                            <p>{product.description || 'توضیحاتی برای این محصول ثبت نشده است.'}</p>
                        </div>

                        {product.verification_notes && (
                            <div className={styles.verificationNotes}>
                                <h3>یادداشت کارشناس</h3>
                                <p>{product.verification_notes}</p>
                            </div>
                        )}

                        {product.stock > 0 && (
                            <div className={styles.addToCart}>
                                <div className={styles.quantityControl}>
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    افزودن به سبد خرید
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
