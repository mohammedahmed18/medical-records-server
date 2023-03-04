// import { nationalId_chars } from '.';
export const error_msgs = {
  UNAUTHORIZED_LOGIN: 'Invalid nationalId or password',
  // NATIONALID_LENGTH_ERROR: `National id must be exactly ${nationalId_chars} characters`,
  RESOURCE_ALREADY_EXISTS: (field = 'resource') =>
    `This ${field} already exists`,

  ADMIN_WRONG_CREDENTIALS: 'Invalid username or password',
};
