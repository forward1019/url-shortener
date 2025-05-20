'use client';

import { FC } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SignOutButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const SignOutButton: FC<SignOutButtonProps> = ({
  className,
  variant = 'outline',
  size = 'default'
}) => {
  const { signOut, isLoading } = useAuth();

  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      onClick={signOut}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Sign out'}
    </Button>
  );
};
