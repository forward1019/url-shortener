// Environment variables with fallbacks
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// API endpoints
export const API_ENDPOINTS = {
  SHORTEN_USER: `${API_URL}/api/shorten`,
  SHORTEN_GUEST: `${API_URL}/api/shorten/guest`,
  REDIRECT: (slug: string) => `${API_URL}/api/${slug}`,
  UPDATE_SLUG: (id: number) => `${API_URL}/api/shorten/${id}/slug`,
  DELETE_SLUG: (id: number) => `${API_URL}/api/shorten/${id}/slug`,
  LIST_ALL_URLS: `${API_URL}/api/urls`,
  LIST_MY_URLS: `${API_URL}/api/my-urls`,
};
