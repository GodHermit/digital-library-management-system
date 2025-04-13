import { ApiProperty } from '@nestjs/swagger';

export class UploadFilesDto {
  @ApiProperty({
    required: true,
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  files: string[];
}
