export const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Check if we're on a subdomain (not main domain)
  if (parts.length > 1 && parts[0] !== 'localhost' && parts[0] !== 'www') {
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

  // For production, return your main domain
  return hostname.split('.').slice(-2).join('.');
};
