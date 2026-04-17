export const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  const { hostname, protocol } = window.location;
  
  // If we are on a standard deployment (not localhost) but no VITE_API_URL is set,
  // we assume the API is on the same host but at port 3000 (standard for this app)
  // or on the same host if it's a proxy setup.
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
     return `${protocol}//${hostname}:3000`;
  }
  
  // For cloud deployments without VITE_API_URL, we try to guess.
  // Many users deploy frontend and backend to the same domain or subdomains.
  // This is a fallback.
  return `${protocol}//${hostname}:3000`;
};
