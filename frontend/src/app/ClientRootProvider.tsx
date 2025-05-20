"use client";
import { Toaster } from "@/components/ui/sonner";

import TopNavBar from "@/components/navBar/TopNav";

export default function ClientRootProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNavBar />
      {children}
      <Toaster />
    </>

  );
}
