// import { nationalId_chars } from '.';
export const error_msgs = {
  UNAUTHORIZED_LOGIN: 'Invalid nationalId or password',
  // NATIONALID_LENGTH_ERROR: `National id must be exactly ${nationalId_chars} characters`,
  RESOURCE_ALREADY_EXISTS: (field = 'resource') =>
    `This ${field} already exists`,

  ADMIN_WRONG_CREDENTIALS: 'Invalid username or password',
};

///error codes [[[]]]

export const INVALID_LOGIN = '04557';
export const EXPIRED_QR_CODE = 'P__ee04557';
export const INVALID_QR_CODE = 'P__ee05557';
export const SCAN_YOUR_SELF_ERR_CODE = 'S__yy2';
