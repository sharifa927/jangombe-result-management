export function getApiBaseUrl(): string {
  const springBackendBaseUrl = 'http://localhost:3001';

  if (typeof window === 'undefined') {
    return `${springBackendBaseUrl}/api`;
  }

  const hostname = window.location.hostname || 'localhost';
  return `http://${hostname}:3001/api`;
}
