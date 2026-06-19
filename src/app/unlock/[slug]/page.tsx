'use client';

import { FormEvent, useState } from 'react';
import { useParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@/lib/api';
import { unlockLink } from '@/lib/api/links';
import { Button } from '@/components/common/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export default function UnlockPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => unlockLink(slug, password),
    onSuccess: ({ targetUrl }) => {
      // Mở khóa thành công → điều hướng thẳng tới đích.
      window.location.replace(targetUrl);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const errorMsg =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'Mở khóa thất bại'
        : null;

  return (
    <div className="relative flex flex-1 items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted">
            <Lock className="size-5" />
          </div>
          <CardTitle>Link được bảo vệ</CardTitle>
          <CardDescription>
            Nhập mật khẩu để truy cập <span className="font-medium">/{slug}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMsg && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              loading={mutation.isPending || mutation.isSuccess}
            >
              Mở khóa & tiếp tục
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
