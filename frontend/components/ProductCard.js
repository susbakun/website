import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
        alert('محصول به سبد خرید اضافه شد');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    return (
        <div className={styles.card}>
            <Link href={`/products/${product.id}`}>
                <div className={styles.imageContainer}>
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                    ) : (
                        <div className={styles.noImage}>بدون تصویر</div>
                    )}

                    {product.is_verified && (
                        <span className={styles.verifiedBadge}>✓ تأیید شده</span>
                    )}
                </div>
            </Link>

            <div className={styles.content}>
                <Link href={`/products/${product.id}`}>
                    <h3 className={styles.title}>{product.name}</h3>
                </Link>

                <p className={styles.description}>
                    {product.description?.substring(0, 80)}
                    {product.description?.length > 80 && '...'}
                </p>

                <div className={styles.footer}>
                    <div className={styles.price}>
                        {formatPrice(product.price)} تومان
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="btn btn-primary"
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد'}
                    </button>
                </div>

                {product.stock > 0 && product.stock < 5 && (
                    <p className={styles.lowStock}>تنها {product.stock} عدد باقی مانده</p>
                )}
            </div>
        </div>
    );
}
