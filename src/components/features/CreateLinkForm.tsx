'use client';

import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api';
import { createLink } from '@/lib/api/links';
import { Button } from '@/components/common/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { toast } from '@/components/common/Toaster';

export function CreateLinkForm() {
  const queryClient = useQueryClient();
  const [targetUrl, setTargetUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      createLink({
        targetUrl,
        customSlug: customSlug.trim() || undefined,
      }),
    onSuccess: (link) => {
      toast.success(`Đã tạo link: ${link.shortUrl}`);
      setTargetUrl('');
      setCustomSlug('');
      void queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : 'Tạo link thất bại'),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo link rút gọn</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="targetUrl">URL đích</Label>
            <Input
              id="targetUrl"
              type="url"
              required
              placeholder="https://example.com/duong-dan-dai"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 sm:w-48">
            <Label htmlFor="customSlug">Slug tùy chọn</Label>
            <Input
              id="customSlug"
              placeholder="(để trống = tự sinh)"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
            />
          </div>
          <Button type="submit" loading={mutation.isPending}>
            Tạo link
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
