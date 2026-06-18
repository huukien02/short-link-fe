'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/lib/auth-storage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(tokenStorage.getAccess() ? '/dashboard' : '/login');
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground">
      Đang tải…
    </div>
  );
}
