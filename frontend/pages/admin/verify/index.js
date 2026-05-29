import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function VerifyIndex() {
    const router = useRouter();

    useEffect(() => {
        router.push('/admin/products');
    }, []);

    return null;
}
