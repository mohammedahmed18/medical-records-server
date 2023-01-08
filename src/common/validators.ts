import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false , name : "fixedLength" })
  export class FixedLengthConstraint implements ValidatorConstraintInterface {
  
    async validate(value: string, args: ValidationArguments) {
        const length = args.constraints[0]
        if(typeof value == "string" && value.length == length) return true
        return false;
    }
  }