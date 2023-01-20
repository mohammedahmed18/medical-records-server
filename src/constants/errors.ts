// import { nationalId_chars } from '.';
export const error_msgs = {
  UNAUTHORIZED_LOGIN: 'Invalid nationalId or password',
  // NATIONALID_LENGTH_ERROR: `National id must be exactly ${nationalId_chars} characters`,
  RESOURCE_ALREADY_EXISTS: (field: string = 'resource') =>
    `This ${field} already exists`,
};
