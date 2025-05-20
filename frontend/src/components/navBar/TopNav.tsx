"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserProfile } from "../../components/auth/UserProfile";
import { FiLink } from 'react-icons/fi';

export default function TopNavBar() {
  const pathname = usePathname();
  const noNavRoutes = ["/error"];

    if (noNavRoutes.includes(pathname)) {
    return null;
  }

  return (
        <header className="border-b fixed top-0 left-0 w-full z-50 bg-white">
           <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-medium"
            >
              <FiLink size={24} />
              URL Shortener
            </Link>
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link
                  href="/urls"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  URLs List
                </Link>
              </nav>
              <UserProfile />
            </div>
          </div>
        </header>
  );
}
