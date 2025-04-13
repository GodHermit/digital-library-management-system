import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerTokenAuth } from '../auth/decorators/bearer-token-auth.decorator';
import { EUserRole } from '../users/types/user.enum';
import { UploadedFileResponseDto } from './dto/upload-files-response.dto';
import { UploadFilesDto } from './dto/upload-files.dto';
import { Request } from 'express';
import { FilesService } from './files.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @BearerTokenAuth(EUserRole.ADMIN)
  @ApiResponse({ type: UploadedFileResponseDto, isArray: true })
  async getFiles(@Req() req: Request) {
    const baseUrl = `${req.protocol}://${req.get('Host')}`;
    return await this.filesService.getFiles(baseUrl);
  }

  @Post('upload')
  @BearerTokenAuth(EUserRole.ADMIN)
  @ApiResponse({ type: UploadedFileResponseDto, isArray: true })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFilesDto })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB
      },
    }),
  )
  async uploadFile(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const baseUrl = `${req.protocol}://${req.get('Host')}`;
    return await this.filesService.uploadFiles(baseUrl, files);
  }

  @Delete('delete')
  @BearerTokenAuth(EUserRole.ADMIN)
  @ApiResponse({ type: String })
  async deleteFile(@Req() req: Request, @Query('filename') filename: string) {
    const baseUrl = `${req.protocol}://${req.get('Host')}`;
    return await this.filesService.deleteFile(baseUrl, filename);
  }
}
