'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { getMe, logout } from '@/lib/api/auth';
import { Button } from '@/components/common/Button';

export function UserMenu() {
  const router = useRouter();
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: getMe });

  const onLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <div className="flex items-center gap-3">
      {user && (
        <div className="flex items-center gap-2">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={user.name ?? user.email}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {user.email[0]?.toUpperCase()}
            </div>
          )}
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-medium">
              {user.name ?? user.email}
            </span>
            {user.name && (
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            )}
          </div>
        </div>
      )}
      <Button variant="outline" size="sm" onClick={() => void onLogout()}>
        <LogOut />
        <span className="hidden sm:inline">Đăng xuất</span>
      </Button>
    </div>
  );
}
