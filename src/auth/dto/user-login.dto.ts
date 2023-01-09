import { FixedLengthConstraint } from '../../common/validators';
import { error_msgs, commons } from './../../constants';
import { IsNotEmpty, IsNumberString, Validate } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  @Validate(FixedLengthConstraint, [commons.nationalId_chars], {
    message: error_msgs.NATIONALID_LENGTH_ERROR,
  })
  nationalId: string;

  @IsNotEmpty()
  password: string;
}
