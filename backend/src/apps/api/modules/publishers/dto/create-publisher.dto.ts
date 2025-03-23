import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreatePublisherDto {
  @ApiProperty({ example: 'Penguin Random House' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://www.penguinrandomhouse.com/' })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  website: string;
}
