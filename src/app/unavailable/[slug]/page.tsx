'use client';

import { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Ban, Clock, LinkIcon } from 'lucide-react';
import { Button } from '@/components/common/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { ThemeToggle } from '@/components/common/ThemeToggle';

type Reason = 'notfound' | 'expired' | 'limit';

const COPY: Record<
  Reason,
  { icon: typeof Ban; title: string; desc: string }
> = {
  notfound: {
    icon: LinkIcon,
    title: 'Link không tồn tại',
    desc: 'Link này không có thật hoặc đã bị chủ sở hữu tắt/xóa.',
  },
  expired: {
    icon: Clock,
    title: 'Link đã hết hạn',
    desc: 'Link này đã quá thời hạn sử dụng và không còn dẫn tới đích nữa.',
  },
  limit: {
    icon: Ban,
    title: 'Link đã đạt giới hạn',
    desc: 'Link này đã dùng hết số lượt click cho phép.',
  },
};

function UnavailableCard() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const reason = (searchParams.get('reason') as Reason) || 'notfound';
  const { icon: Icon, title, desc } = COPY[reason] ?? COPY.notfound;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Icon className="size-5" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {desc} (<span className="font-medium">/{params.slug}</span>)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => (window.location.href = '/')}
        >
          Về trang chủ
        </Button>
      </CardContent>
    </Card>
  );
}

export default function UnavailablePage() {
  return (
    <div className="relative flex flex-1 items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Suspense fallback={null}>
        <UnavailableCard />
      </Suspense>
    </div>
  );
}
