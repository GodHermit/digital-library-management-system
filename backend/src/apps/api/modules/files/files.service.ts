import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import * as mimeTypes from 'mime-types';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  async getFiles(
    baseUrl: string,
  ): Promise<{ filename: string; url: string }[]> {
    const filePath = join(__dirname, '../../../../../public/assets');
    this.logger.log(`Getting files from ${filePath}`);
    const files = fs.readdirSync(filePath, { recursive: true });
    this.logger.log(`Files found: ${files}`);
    return files.map((file) => {
      const fileUrl = `${baseUrl}/assets/${file}`;
      return {
        filename: file,
        url: fileUrl,
      };
    });
  }

  async uploadFiles(
    baseUrl: string,
    files: Express.Multer.File[],
  ): Promise<{ filename: string; url: string }[]> {
    return await Promise.all(
      files.map(async (file) => {
        const extensionFromFileName = file.originalname.split('.').pop();
        const extension =
          mimeTypes.extension(file.mimetype) || extensionFromFileName;

        const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
        const fileUrl = `${baseUrl}/assets/${fileName}`;
        const filePath = join(__dirname, '../../../../../public/assets');

        this.logger.log(`Saving file to ${filePath}/${fileName}`);
        const isDirectoryExists = fs.existsSync(filePath);
        if (!isDirectoryExists) {
          this.logger.warn(`Directory ${filePath} does not exist. Creating...`);
          fs.mkdirSync(filePath, { recursive: true });
        }
        fs.writeFileSync(join(filePath, fileName), file.buffer);
        this.logger.log(`File saved to ${filePath}/${fileName}`);

        return {
          filename: fileName,
          url: fileUrl,
        };
      }),
    );
  }

  async deleteFile(
    baseUrl: string,
    fileName: string,
  ): Promise<{ filename: string; url: string }> {
    const filePath = join(__dirname, '../../../../../public/assets', fileName);
    this.logger.log(`Deleting file ${filePath}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.logger.log(`File ${filePath} deleted`);
    } else {
      this.logger.warn(`File ${filePath} does not exist`);
    }

    const fileUrl = `${baseUrl}/assets/${fileName}`;
    return {
      filename: fileName,
      url: fileUrl,
    };
  }
}
