'use client';

import { Copy, ExternalLink, Lock, Timer, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api';
import { deleteLink, listLinks } from '@/lib/api/links';
import { Link } from '@/lib/types';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/common/Table';
import { toast } from '@/components/common/Toaster';
import { QrDialog } from './QrDialog';

function formatExpiry(iso: string): string {
  const d = new Date(iso);
  const expired = d.getTime() < Date.now();
  return `${expired ? 'Hết hạn' : 'Hết hạn lúc'} ${d.toLocaleDateString('vi-VN')}`;
}

function LinkBadges({ link }: { link: Link }) {
  const expired = link.expiresAt && new Date(link.expiresAt).getTime() < Date.now();
  return (
    <div className="flex flex-wrap gap-1">
      {!link.isActive && <Badge variant="destructive">Tắt</Badge>}
      {link.hasPassword && (
        <Badge variant="secondary">
          <Lock /> Mật khẩu
        </Badge>
      )}
      {link.expiresAt && (
        <Badge variant={expired ? 'destructive' : 'outline'}>
          <Timer /> {formatExpiry(link.expiresAt)}
        </Badge>
      )}
    </div>
  );
}

export function LinksTable() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['links'],
    queryFn: () => listLinks(),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteLink(id),
    onSuccess: () => {
      toast.success('Đã xóa link');
      void queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : 'Xóa thất bại'),
  });

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Đã copy link');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link của bạn {data ? `(${data.total})` : ''}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Đang tải…</p>
        )}
        {isError && (
          <p className="text-sm text-destructive">Không tải được danh sách.</p>
        )}
        {data && data.items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Chưa có link nào. Tạo link đầu tiên ở trên.
          </p>
        )}
        {data && data.items.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short URL</TableHead>
                <TableHead>URL đích</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="w-40 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-medium">/{link.slug}</span>
                      <LinkBadges link={link} />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {link.targetUrl}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {link.clickCount}
                    {link.maxClicks != null && (
                      <span className="text-muted-foreground">
                        {' / '}
                        {link.maxClicks}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <QrDialog link={link} />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => void copy(link.shortUrl)}
                        aria-label="Copy"
                      >
                        <Copy />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          window.open(link.shortUrl, '_blank', 'noopener')
                        }
                        aria-label="Mở"
                      >
                        <ExternalLink />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        loading={
                          removeMutation.isPending &&
                          removeMutation.variables === link.id
                        }
                        onClick={() => removeMutation.mutate(link.id)}
                        aria-label="Xóa"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
