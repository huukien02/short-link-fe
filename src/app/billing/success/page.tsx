'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function BillingSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Gói được nâng qua webhook (bất đồng bộ). Làm mới 'me' để FE đọc plan mới
    // ngay khi webhook đã xử lý xong (thường chỉ vài giây).
    void queryClient.invalidateQueries({ queryKey: ['me'] });
  }, [queryClient]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <CheckCircle2 className="h-12 w-12 text-green-500" />
      <h1 className="text-2xl font-semibold">Thanh toán thành công</h1>
      <p className="text-muted-foreground">
        Cảm ơn bạn! Gói Pro sẽ được kích hoạt trong giây lát. Nếu chưa thấy đổi,
        hãy tải lại trang sau ít phút.
      </p>
      <Button onClick={() => router.push('/dashboard')}>Về Dashboard</Button>
    </div>
  );
}
