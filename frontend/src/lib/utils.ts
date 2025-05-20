import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateUrl(url: string, maxLength = 50) {
  return url.length > maxLength
    ? `${url.substring(0, maxLength)}...`
    : url;
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function constructShortUrl(slug: string) {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/${slug}`;
  }
  return `/${slug}`;
}

export function cleanParams<T extends Record<string, any>>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== undefined && v !== null && v !== ""
    )
  ) as Partial<T>;
}

export function extractSlugFromShortUrl(shortUrl: string): string {
  try {
    const url = new URL(shortUrl, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return url.pathname.replace(/^\//, "");
  } catch {
    return shortUrl.split("/").pop() || "";
  }
}
