'use client';

import { useEffect, useState } from 'react';
import { Download, QrCode } from 'lucide-react';
import { ApiError } from '@/lib/api';
import { fetchLinkQr } from '@/lib/api/links';
import { Link } from '@/lib/types';
import { Button } from '@/components/common/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/common/Dialog';
import { toast } from '@/components/common/Toaster';

export function QrDialog({ link }: { link: Link }) {
  const [open, setOpen] = useState(false);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Nạp QR (PNG) khi mở dialog; thu hồi object URL khi đóng để tránh rò bộ nhớ.
  useEffect(() => {
    if (!open) return;
    let revoked = false;
    let url: string | null = null;

    setLoading(true);
    fetchLinkQr(link.id, 'png')
      .then((blob) => {
        if (revoked) return;
        url = URL.createObjectURL(blob);
        setPngUrl(url);
      })
      .catch((err) =>
        toast.error(err instanceof ApiError ? err.message : 'Lỗi tạo QR'),
      )
      .finally(() => !revoked && setLoading(false));

    return () => {
      revoked = true;
      if (url) URL.revokeObjectURL(url);
      setPngUrl(null);
    };
  }, [open, link.id]);

  const download = async (format: 'png' | 'svg') => {
    try {
      const blob = await fetchLinkQr(link.id, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-${link.slug}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Tải QR thất bại');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="QR code" />
        }
      >
        <QrCode />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR code</DialogTitle>
          <DialogDescription className="truncate">
            {link.shortUrl}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center rounded-lg bg-white p-4">
          {loading || !pngUrl ? (
            <div className="flex size-64 items-center justify-center text-sm text-muted-foreground">
              Đang tạo…
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pngUrl} alt="QR code" className="size-64" />
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => void download('png')}
          >
            <Download />
            PNG
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => void download('svg')}
          >
            <Download />
            SVG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
