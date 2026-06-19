'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function BillingCancelPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <XCircle className="h-12 w-12 text-muted-foreground" />
      <h1 className="text-2xl font-semibold">Đã hủy thanh toán</h1>
      <p className="text-muted-foreground">
        Bạn chưa bị tính phí. Có thể nâng cấp lại bất cứ lúc nào.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Về Dashboard
        </Button>
        <Button onClick={() => router.push('/billing')}>Xem gói cước</Button>
      </div>
    </div>
  );
}
