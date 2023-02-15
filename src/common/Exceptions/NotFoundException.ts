import { CustomError } from './../errors/custome.error';
import { ExceptionFilter } from "@nestjs/common";
import { Catch, NotFoundException } from "@nestjs/common";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch() {
        return new CustomError({
            statusCode : 404,
            msg :"not found"
        })
    }
}