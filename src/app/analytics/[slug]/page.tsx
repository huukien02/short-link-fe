'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStatus } from '@/lib/use-auth';
import { tokenStorage } from '@/lib/auth-storage';
import { AnalyticsView } from '@/components/features/AnalyticsView';
import { Button } from '@/components/common/Button';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export default function AnalyticsPage() {
  const router = useRouter();
  const status = useAuthStatus();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  useEffect(() => {
    // Cùng logic guard với dashboard: chỉ đá về /login khi chắc chắn chưa đăng nhập.
    if (status === 'guest' && !tokenStorage.getAccess()) {
      router.replace('/login');
    }
  }, [status, router]);

  if (status !== 'authed') {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Đang tải…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Thống kê</h1>
          <p className="text-sm text-muted-foreground">/{slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            ← Dashboard
          </Button>
        </div>
      </header>

      <AnalyticsView slug={slug} />
    </div>
  );
}
