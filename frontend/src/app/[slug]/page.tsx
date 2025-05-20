"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config";

interface RedirectPageProps {
  params: {
    slug: string;
  };
}

export default function RedirectPage({ params }: RedirectPageProps) {
  const router = useRouter();
  const slug = params.slug;

  useEffect(() => {
    console.log("Redirect triggered for slug:", slug);

    if (["dashboard", "urls", "auth", "error"].includes(slug)) {
      console.log("Reserved slug detected, redirecting to home");
      router.push("/");
      return;
    }

    const redirectToOriginalUrl = async () => {
      try {
        const apiUrl = `${API_URL}/api/${slug}`;
        console.log("Redirecting to API URL:", apiUrl);
        window.location.href = apiUrl;
      } catch (error) {
        console.error("Redirect error:", error);
        router.push("/error");
      }
    };

    redirectToOriginalUrl();
  }, [slug, router]);

  return (
    <div className="container py-20">
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-lg text-muted-foreground">
          Redirecting to destination...
        </p>
      </div>
    </div>
  );
}
