'use client';

import { FC } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/contexts/AuthContext';
import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';

interface UserProfileProps {
  className?: string;
}

export const UserProfile: FC<UserProfileProps> = ({ className }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>;
  }

  if (!isAuthenticated) {
    return <SignInButton className={className} size={'lg'}/>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium">{user?.name}</span>
        <span className="text-xs text-gray-500">{user?.email}</span>
      </div>
      <div className="relative">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
          <FcGoogle size={22} />
        </div>

      </div>
      <SignOutButton size="sm"  className='ml-4'/>
    </div>
  );
};
