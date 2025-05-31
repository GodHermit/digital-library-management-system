import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { EXAMPLE_UUID } from '../../books/constants/examples';

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

  @ApiProperty({ example: EXAMPLE_UUID, required: false })
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  ownerId?: string;
}
