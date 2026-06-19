'use client';

import { FormEvent, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api';
import { createLink } from '@/lib/api/links';
import { CreateLinkInput } from '@/lib/types';
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

const EMPTY = {
  targetUrl: '',
  customSlug: '',
  expiresAt: '',
  maxClicks: '',
  password: '',
};

export function CreateLinkForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const mutation = useMutation({
    mutationFn: () => {
      const input: CreateLinkInput = { targetUrl: form.targetUrl };
      if (form.customSlug.trim()) input.customSlug = form.customSlug.trim();
      if (form.expiresAt) input.expiresAt = new Date(form.expiresAt).toISOString();
      // Để trống = không giới hạn (bỏ qua). Có nhập thì ép số nguyên ≥ 1.
      if (form.maxClicks.trim()) {
        input.maxClicks = Math.max(1, Math.floor(Number(form.maxClicks)));
      }
      if (form.password) input.password = form.password;
      return createLink(input);
    },
    onSuccess: (link) => {
      toast.success(`Đã tạo link: ${link.shortUrl}`);
      setForm(EMPTY);
      setShowAdvanced(false);
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
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="targetUrl">URL đích</Label>
              <Input
                id="targetUrl"
                type="url"
                required
                placeholder="https://example.com/duong-dan-dai"
                value={form.targetUrl}
                onChange={(e) => set('targetUrl')(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:w-48">
              <Label htmlFor="customSlug">Slug tùy chọn</Label>
              <Input
                id="customSlug"
                placeholder="(để trống = tự sinh)"
                value={form.customSlug}
                onChange={(e) => set('customSlug')(e.target.value)}
              />
            </div>
            <Button type="submit" loading={mutation.isPending}>
              Tạo link
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            {showAdvanced ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
            Tùy chọn nâng cao
          </button>

          {showAdvanced && (
            <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="expiresAt">Hết hạn lúc</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => set('expiresAt')(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="maxClicks">Giới hạn lượt click</Label>
                <Input
                  id="maxClicks"
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  placeholder="(để trống = không giới hạn)"
                  value={form.maxClicks}
                  // Chỉ giữ chữ số → không cho âm/thập phân; rỗng = không giới hạn.
                  onChange={(e) =>
                    set('maxClicks')(e.target.value.replace(/\D/g, ''))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Mật khẩu bảo vệ</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="(không đặt)"
                  value={form.password}
                  onChange={(e) => set('password')(e.target.value)}
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
