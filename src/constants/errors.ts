import { commons } from './common';
export const error_msgs = {
  UNAUTHORIZED_LOGIN: 'Invalid nationalId or password',
  NATIONALID_LENGTH_ERROR: `National id must be exactly ${commons.nationalId_chars} characters`,
  ACCOUNT_ALREADY_EXISTS: (field: string = 'resource') =>
    `This ${field} already exists`,
};
