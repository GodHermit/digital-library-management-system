import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({ example: 'Fantasy' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
