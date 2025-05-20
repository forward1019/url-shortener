'use client';
import { FC } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

interface SignInButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const SignInButton: FC<SignInButtonProps> = ({
  className,
  variant = 'default',
  size = 'default'
}) => {
  const { signInWithGoogle, isLoading } = useAuth();

  return (
    <Button
      className={`flex items-center bg-gray-100 hover:bg-gray-200 text-black px-6 py-2 rounded-lg border border-gray-300 shadow-sm transition ${className ?? ''}`}
      variant={variant}
      size={size}
      onClick={signInWithGoogle}
      disabled={isLoading}
    >
       <FcGoogle size={22} />
      {isLoading ? 'Loading...' : 'Sign in with Google'}
    </Button>
  );
};
