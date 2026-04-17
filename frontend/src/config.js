export const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, ""); // Remove trailing slash
  }
  
  const { hostname, protocol } = window.location;
  
  // Local development fallback
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
     return `${protocol}//${hostname}:3000`;
  }
  
  // For cloud deployments, if VITE_API_URL is missing, we default to the current host.
  // We assume the user might have a reverse proxy or is using the same domain.
  // If this is wrong, the "Connection Failed" UI will help them debug.
  return `${protocol}//${hostname}`;
};
