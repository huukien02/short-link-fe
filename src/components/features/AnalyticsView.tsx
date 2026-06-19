'use client';

import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '@/lib/api/analytics';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';

const DEVICE_LABEL: Record<string, string> = {
  desktop: 'Máy tính',
  mobile: 'Điện thoại',
  tablet: 'Máy tính bảng',
  unknown: 'Không rõ',
};

function label(value: string, map?: Record<string, string>): string {
  if (value === 'unknown') return map?.unknown ?? 'Không rõ';
  return map?.[value] ?? value;
}

/** Danh sách thanh ngang (cho quốc gia / thiết bị). */
function BarList({
  items,
  map,
}: {
  items: { name: string; count: number }[];
  map?: Record<string, string>;
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>;
  }
  return (
    <div className="flex flex-col gap-2">
      {items.map((i) => (
        <div key={i.name} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 truncate">{label(i.name, map)}</span>
          <div className="relative h-6 flex-1 overflow-hidden rounded bg-muted">
            <div
              className="h-full rounded bg-primary/80"
              style={{ width: `${(i.count / max) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right tabular-nums">
            {i.count}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Biểu đồ cột theo ngày. */
function DayChart({ items }: { items: { date: string; count: number }[] }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>;
  }
  return (
    <div className="flex h-48 items-end gap-1.5 overflow-x-auto">
      {items.map((i) => (
        <div
          key={i.date}
          className="flex min-w-8 flex-1 flex-col items-center gap-1"
          title={`${i.date}: ${i.count}`}
        >
          <span className="text-xs tabular-nums text-muted-foreground">
            {i.count}
          </span>
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t bg-primary/80"
              style={{ height: `${(i.count / max) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">
            {i.date.slice(5)}
          </span>
        </div>
      ))}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsView({ slug }: { slug: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['analytics', slug],
    queryFn: () => getAnalytics(slug),
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Đang tải thống kê…</p>;
  }
  if (isError || !data) {
    return (
      <p className="text-destructive">
        {(error as Error)?.message ?? 'Không tải được thống kê'}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Tổng click" value={data.total} />
        <Kpi label="Số ngày có click" value={data.byDay.length} />
        <Kpi label="Số quốc gia" value={data.byCountry.length} />
        <Kpi label="Loại thiết bị" value={data.byDevice.length} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Click theo ngày</CardTitle>
        </CardHeader>
        <CardContent>
          <DayChart items={data.byDay} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theo quốc gia</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              items={data.byCountry.map((c) => ({
                name: c.country,
                count: c.count,
              }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Theo thiết bị</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              items={data.byDevice.map((d) => ({
                name: d.device,
                count: d.count,
              }))}
              map={DEVICE_LABEL}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
