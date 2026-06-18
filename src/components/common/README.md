# components/common — wrapper component của app

> ✅ **Cả app chỉ import component từ đây.**
> Đây là tầng "design system" của app: bọc lại shadcn (`components/ui/*`), thêm variant/logic/loading/style riêng.

## Luật
- Mọi page/feature import từ `@/components/common/*`, không bao giờ từ `@/components/ui/*`.
- Mỗi primitive shadcn → 1 wrapper tương ứng ở đây (Button, Input, Table, Dialog...).

## Ví dụ wrapper

```tsx
// components/common/Button.tsx
import { Button as UIButton } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = React.ComponentProps<typeof UIButton> & { loading?: boolean };

export function Button({ loading, children, disabled, ...props }: Props) {
  return (
    <UIButton disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </UIButton>
  );
}
```

Page dùng:
```tsx
import { Button } from "@/components/common/Button"; // ✅
```
