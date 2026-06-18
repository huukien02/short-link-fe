'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStatus } from '@/lib/use-auth';
import { tokenStorage } from '@/lib/auth-storage';
import { CreateLinkForm } from '@/components/features/CreateLinkForm';
import { LinksTable } from '@/components/features/LinksTable';
import { UserMenu } from '@/components/features/UserMenu';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export default function DashboardPage() {
  const router = useRouter();
  const status = useAuthStatus();

  useEffect(() => {
    // Chỉ redirect khi CHẮC CHẮN chưa đăng nhập: vừa 'guest' vừa xác nhận
    // token thật sự không còn (đọc thẳng localStorage, không dựa snapshot SSR).
    // Còn token thì không bao giờ đá đi — miễn nhiễm với timing hydration.
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
        <h1 className="text-xl font-semibold">URL Shortener Pro</h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <CreateLinkForm />
        <LinksTable />
      </div>
    </div>
  );
}
