"use client";

import { Suspense } from "react";
import { SignInButton } from "@/components/auth";
import ClientRootProvider from "./ClientRootProvider";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

// Separate client component that uses useSearchParams
import { AuthRedirect } from "@/components/auth";

export default function HomePage() {
  const router = useRouter();

  const handleContinueAsGuest = () => {
    router.push("/urls");
  };

  return (
    <ClientRootProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthRedirect />
      </Suspense>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="mt-2 text-gray-600">Sign in or continue as a guest</p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex flex-col items-center">
              <SignInButton className="w-full max-w-xs" size="lg" />
              <div className="my-6 flex items-center w-full">
                <hr className="flex-1 border-gray-300" />
                <span className="mx-4 text-gray-400">or</span>
                <hr className="flex-1 border-gray-300" />
              </div>
              <Button
                onClick={handleContinueAsGuest}
                className="w-80 h-10 flex items-center bg-gray-100 hover:bg-gray-200 text-black px-6 py-2 rounded-lg border border-gray-300 shadow-sm transition"
              >
                <User size={20} className="text-blue-400" />
                Continue as Guest
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ClientRootProvider>
  );
}
