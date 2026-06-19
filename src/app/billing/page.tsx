'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuthStatus } from '@/lib/use-auth';
import { tokenStorage } from '@/lib/auth-storage';
import { ApiError } from '@/lib/api';
import { getMe } from '@/lib/api/auth';
import { createCheckout, openPortal } from '@/lib/api/billing';
import { Button } from '@/components/common/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Logo } from '@/components/common/Logo';
import { toast } from '@/components/common/Toaster';

// Hiển thị tĩnh — khớp plans.config bên backend. BE mới là nơi enforce/seed.
interface PlanCard {
  key: string;
  name: string;
  price: string;
  paid: boolean;
  highlight?: boolean;
  features: string[];
}

const PLAN_CARDS: PlanCard[] = [
  {
    key: 'free',
    name: 'Free',
    price: '0₫',
    paid: false,
    features: ['Tối đa 10 link', 'QR code', 'Analytics cơ bản'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '49.000₫',
    paid: true,
    highlight: true,
    features: [
      'Tối đa 1.000 link',
      'Custom slug',
      'Bảo vệ bằng mật khẩu',
      'Link hết hạn (thời gian / lượt click)',
      'Analytics chi tiết',
    ],
  },
  {
    key: 'business',
    name: 'Business',
    price: '149.000₫',
    paid: true,
    features: [
      'Link KHÔNG giới hạn',
      'Mọi tính năng của Pro',
      'Ưu tiên hỗ trợ',
    ],
  },
];

export default function BillingPage() {
  const router = useRouter();
  const status = useAuthStatus();
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: getMe });

  useEffect(() => {
    if (status === 'guest' && !tokenStorage.getAccess()) {
      router.replace('/login');
    }
  }, [status, router]);

  // Mua gói → redirect sang Checkout hosted. `variables` = planKey đang xử lý.
  const checkout = useMutation({
    mutationFn: createCheckout,
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : 'Không mở được trang thanh toán',
      ),
  });

  // Quản lý gói (đổi/hủy/thẻ) → redirect Customer Portal.
  const portal = useMutation({
    mutationFn: openPortal,
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError ? err.message : 'Không mở được cổng quản lý',
      ),
  });

  if (status !== 'authed') {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Đang tải…
      </div>
    );
  }

  const currentPlan = user?.plan ?? 'free';

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <Logo />
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft />
          <span className="hidden sm:inline">Về Dashboard</span>
        </Button>
      </header>

      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Gói cước</h1>
        <Badge variant={currentPlan === 'free' ? 'secondary' : 'default'}>
          Đang dùng:{' '}
          {PLAN_CARDS.find((p) => p.key === currentPlan)?.name ?? currentPlan}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PLAN_CARDS.map((plan) => {
          const isCurrent = plan.key === currentPlan;
          const pending = checkout.isPending && checkout.variables === plan.key;

          return (
            <Card key={plan.key} className={plan.highlight ? 'border-primary' : undefined}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {plan.highlight && <Sparkles className="h-5 w-5 text-primary" />}
                  {plan.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-4">
                <p className="text-2xl font-bold">
                  {plan.price}
                  {plan.paid && (
                    <span className="text-sm font-normal text-muted-foreground">
                      /tháng
                    </span>
                  )}
                </p>

                <ul className="flex flex-col gap-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check
                        className={
                          plan.highlight
                            ? 'h-4 w-4 text-primary'
                            : 'h-4 w-4 text-muted-foreground'
                        }
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">{renderAction()}</div>
              </CardContent>
            </Card>
          );

          function renderAction() {
            if (isCurrent) {
              // Gói hiện tại: nếu là gói trả phí → cho mở Portal để quản lý.
              return plan.paid ? (
                <Button
                  variant="outline"
                  className="w-full"
                  loading={portal.isPending}
                  onClick={() => portal.mutate()}
                >
                  Quản lý gói
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Gói hiện tại
                </Button>
              );
            }
            if (!plan.paid) {
              // Đang ở gói trả phí, muốn về Free → qua Portal để hủy.
              return (
                <Button
                  variant="outline"
                  className="w-full"
                  loading={portal.isPending}
                  onClick={() => portal.mutate()}
                >
                  Hạ xuống Free
                </Button>
              );
            }
            return (
              <Button
                className="w-full"
                loading={pending}
                onClick={() => checkout.mutate(plan.key)}
              >
                Chọn {plan.name}
              </Button>
            );
          }
        })}
      </div>
    </div>
  );
}
