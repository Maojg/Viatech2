const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');

export function apiUrl(path) {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${suffix}`;
}
