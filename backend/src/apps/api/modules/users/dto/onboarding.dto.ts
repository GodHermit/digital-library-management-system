import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { EUserType } from '../types/user.enum';
import { CreatePublisherDto } from '../../publishers/dto/create-publisher.dto';

export class OnboardingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(EUserType)
  userType: EUserType;

  @ApiProperty()
  @ValidateIf((o) => o.userType === EUserType.PUBLISHER)
  @ValidateNested()
  organization: CreatePublisherDto;
}
