export const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Check if we're on a subdomain (not main domain)
  if (
    parts.length > 1 &&
    parts[0] !== 'localhost' &&
    parts[0] !== 'www' &&
    hostname !== 'shop-sphere-auth-hub.vercel.app'
  ) {
    return parts[0];
  }

  return null;
};

export const isSubdomain = (): boolean => {
  return getSubdomain() !== null;
};

export const getMainDomain = (): string => {
  if (typeof window === 'undefined') return 'localhost:5173';

  const hostname = window.location.hostname;
  const port = window.location.port;

  if (hostname === 'localhost') {
    return `localhost${port ? `:${port}` : ''}`;
  }

  // Return the main Vercel domain
  if (hostname === 'shop-sphere-auth-hub.vercel.app') {
    return hostname;
  }

  // For subdomains, return the main domain
  const mainDomain = 'shop-sphere-auth-hub.vercel.app';
  return mainDomain;
};
