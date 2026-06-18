'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/lib/auth-storage';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Token được backend đính ở hash (#); đọc thêm query để phòng hờ.
    const fromHash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const fromSearch = new URLSearchParams(
      window.location.search.replace(/^\?/, ''),
    );
    const accessToken =
      fromHash.get('accessToken') ?? fromSearch.get('accessToken');
    const refreshToken =
      fromHash.get('refreshToken') ?? fromSearch.get('refreshToken');

    if (accessToken && refreshToken) {
      tokenStorage.set(accessToken, refreshToken);
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground">
      Đang đăng nhập…
    </div>
  );
}
