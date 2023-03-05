import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      Readable.from(file.buffer).pipe(upload); // covert buffer to readable stream
    });
  }
  getImageNameByUrl(url: string) {
    const arr = url.split('/');
    const imageWithPrefix = arr[arr.length - 1];

    return imageWithPrefix.split('.')[0];
  }

  async deleteImage(url: string): Promise<void> {
    const imageName = this.getImageNameByUrl(url);
    await v2.uploader.destroy(imageName);
  }
}
