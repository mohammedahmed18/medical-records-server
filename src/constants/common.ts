import isProd from 'src/utils/isProd';
export const TOKEN_LIFETIME = 60 * 60 * 24 * 7; //1 week
export const QR_LIFETIME = 5 * 60; //5 minutes
export const NATIONALID_HASH_LIFETIME = 60 * 60; //1 hour
export const ADMIN_TOKEN_LIFETIME = 60 * 60 * 24; //1 day
export const RT_TOKEN_LIFETIME = 60 * 60 * 24 * 7; //1 week
export const MAX_PROFILE_IMAGE_SIZE_MB = 1; // 1MB

export const CLIENT_URL = isProd
  ? 'https://medical-records-web.vercel.app'
  : 'http://localhost:3001';
export const NETLIFY_URL = 'https://medical-records1.netlify.app';
export const SERVER_URL = isProd
  ? 'https://medical-records-server1.onrender.com'
  : 'http://localhost:3000';
export const STAGING_URL =
  'https://medical-records-web-git-staging-mohammedahmed18.vercel.app';
export const CLIENT_WHITELIST = [CLIENT_URL, NETLIFY_URL, STAGING_URL];
