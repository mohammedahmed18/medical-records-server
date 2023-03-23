import isProd from 'src/utils/isProd';
export const TOKEN_LIFETIME = 60 * 60 * 24 * 7; //1 week
export const QR_LIFETIME = 60; //1 minute
export const NATIONALID_HASH_LIFETIME = 60 * 60; //1 hour
export const ADMIN_TOKEN_LIFETIME = 60 * 60 * 24; //1 day
export const RT_TOKEN_LIFETIME = 60 * 60 * 24 * 7; //1 week
export const MAX_PROFILE_IMAGE_SIZE_MB = 0.5; // 0.5MB

export const CLIENT_URL = isProd
  ? 'https://medical-records-web.vercel.app'
  : 'http://localhost:3001';
