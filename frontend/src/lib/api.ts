import { API_ENDPOINTS } from '@/config';

export interface ShortenUrlRequest {
  originalUrl: string;
  shortSlug?: string;
}

export interface EditShortenUrlRequest {
  shortSlug: string;
}

export interface ShortenedUrlResponse {
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  visitCount: number;
  originDomain: string;
}

export interface LinkData {
  id: number;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  visitCount: number;
  originDomain: string;
}

export interface PaginatedLinks {
  data: LinkData[];
  meta: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
  };
}

/**
 * Shorten a URL for non-auth user
 * @param url The URL to shorten
 * @returns The shortened URL information
 */
export async function shortenGuestUrl(data: ShortenUrlRequest): Promise<ShortenedUrlResponse> {
  const response = await fetch(API_ENDPOINTS.SHORTEN_GUEST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to shorten URL');
  }

  return response.json();
}

/**
 * Shorten a URL for an authenticated user.
 * @param data The URL (and optional custom slug) to shorten
 * @param token The JWT token for authentication
 * @returns The shortened URL information
 */
export async function shortenUserUrl(
  data: ShortenUrlRequest,
  token: string
): Promise<ShortenedUrlResponse> {
  const response = await fetch(API_ENDPOINTS.SHORTEN_USER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to shorten URL');
  }

  return response.json();
}

/**
 * Get the original URL from a short slug
 * @param slug The short slug
 * @returns The original URL
 */
export async function getOriginalUrl(slug: string): Promise<{ originalUrl: string }> {
  const response = await fetch(API_ENDPOINTS.REDIRECT(slug));

  if (!response.ok) {
    throw new Error('Failed to get original URL');
  }

  return response.json();
}

/**
 * Get all URLs
 * @param params Optional query parameters like page, limit, keyword filter, etc.
 * @returns Paginated list of URLs
 */
export async function getAllUrls(params?: Record<string, any>): Promise<PaginatedLinks> {
  let url = API_ENDPOINTS.LIST_ALL_URLS;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch URLs');
  }

  return response.json();
}

/**
 * Get all User URLs
 * @param params Optional query parameters like page, limit, keyword filter, etc.
 * @returns Paginated list of user URLs
 */
export async function getUserUrls(token: string, params?: Record<string, any>): Promise<PaginatedLinks> {
  let url = API_ENDPOINTS.LIST_MY_URLS;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch URLs');
  }

  return response.json();
}


/**
 * Delete a user's shortened URL.
 * @param id    The id of the URL to delete
 * @param token The JWT token for authentication
 */
export async function deleteUserUrl(
  id: number,
  token: string
): Promise<void> {
  const response = await fetch(API_ENDPOINTS.DELETE_SLUG(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to delete URL');
  }
}


/**
 * Edit a user's shortened URL (slug or original URL).
 * @param id    The id of the URL to edit
 * @param data  The fields to update (originalUrl, shortSlug, etc.)
 * @param token The JWT token for authentication
 * @returns     The updated URL info
 */
export async function editUserUrl(
  id: number,
  data: EditShortenUrlRequest,
  token: string
): Promise<ShortenedUrlResponse> {
  const response = await fetch(API_ENDPOINTS.UPDATE_SLUG(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to edit URL');
  }

  return response.json();
}
