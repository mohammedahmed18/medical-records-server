import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileUploadValidationPipe implements PipeTransform<any> {
  async transform(value: Express.Multer.File) {
    const { size, mimetype } = value;
    const maxFileSize = 0.3 * 1024 * 1024; // 0.3MB

    if (size > maxFileSize) {
      throw new BadRequestException(
        `File size too large. Maximum file size is ${
          maxFileSize / (1024 * 1024)
        } MB`,
      );
    }

    // You can also validate the file type here, for example:
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(mimetype)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types are: ${allowedTypes.join(', ')}`,
      );
    }

    // If everything is valid, return the file object
    return value;
  }
}
