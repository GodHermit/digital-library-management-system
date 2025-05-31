import { ApiProperty } from '@nestjs/swagger';

export class UploadedFileResponseDto {
  @ApiProperty({
    description: 'The name of the uploaded image',
    example: 'sample.pdf',
  })
  filename: string;

  @ApiProperty({
    description: 'The URL of the uploaded image',
    example: 'https://example.com/sample.pdf',
  })
  url: string;

  constructor(obj: Partial<UploadedFileResponseDto>) {
    Object.assign(this, obj);
  }
}
