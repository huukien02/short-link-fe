import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Button as UIButton } from '@/components/ui/button';

export type ButtonProps = React.ComponentProps<typeof UIButton> & {
  loading?: boolean;
};

/** Wrapper của app cho Button — thêm trạng thái loading. */
export function Button({
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <UIButton disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </UIButton>
  );
}
