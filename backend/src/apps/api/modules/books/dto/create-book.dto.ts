import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  EXAMPLE_COVER_URL,
  EXAMPLE_DATE,
  EXAMPLE_DESCRIPTION,
  EXAMPLE_EDITION,
  EXAMPLE_FILE_URL,
  EXAMPLE_FORMAT,
  EXAMPLE_LANGUAGE,
  EXAMPLE_PRICE_IN_ETH,
  EXAMPLE_SERIES_ID,
  EXAMPLE_TITLE,
  EXAMPLE_UUID,
  EXAMPLE_UUIDS,
} from '../constants/examples';

export class CreateBookDto {
  @ApiProperty({ example: EXAMPLE_TITLE })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: EXAMPLE_DESCRIPTION })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: EXAMPLE_DATE })
  @IsDateString()
  @IsNotEmpty()
  publishedAt: Date;

  @ApiProperty({ example: EXAMPLE_UUID })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  publishedByUserId: string;

  @ApiProperty({ example: EXAMPLE_LANGUAGE })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({ example: EXAMPLE_COVER_URL, required: false })
  @IsString()
  @IsOptional()
  coverUrl?: string;

  @ApiProperty({ example: EXAMPLE_PRICE_IN_ETH })
  @IsNumber()
  @IsNotEmpty()
  priceInETH: number;

  @ApiProperty({ example: EXAMPLE_UUID })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  publisherId: string;

  @ApiProperty({ example: EXAMPLE_UUIDS })
  @IsOptional()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  authorIds: string[];

  @ApiProperty({ example: EXAMPLE_UUIDS })
  @IsUUID('4', { each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  @IsNotEmpty()
  genreIds: string[];

  @ApiProperty({ example: EXAMPLE_SERIES_ID, required: false })
  @IsUUID()
  @IsOptional()
  seriesId?: string;

  @ApiProperty({ example: EXAMPLE_EDITION, required: false })
  @IsString()
  @IsOptional()
  edition?: string;

  @ApiProperty({ example: EXAMPLE_FORMAT, required: false })
  @IsString()
  @IsOptional()
  format?: string;

  @ApiProperty({ example: EXAMPLE_FILE_URL })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  fileUrl?: string;

  @ApiProperty({ example: 'B08FC5L3RG', required: false })
  @IsString()
  @Matches(/^[A-Z0-9]{10}$/, {
    message: 'ASIN must be a valid 10-character alphanumeric string',
  })
  @IsOptional()
  asin?: string;

  @ApiProperty({ example: '978-3-16-148410-0', required: false })
  @IsString()
  @Matches(/^(97(8|9))?\d{9}(\d|X)$/, {
    message: 'ISBN must be a valid ISBN-10 or ISBN-13 format',
  })
  @IsOptional()
  isbn?: string;
}
