import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateUserDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  id?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  email?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  defaultWallet: string;

  @ApiProperty({ isArray: true, type: 'string' })
  @IsOptional()
  @IsString({ each: true })
  nonDefaultWallets: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  privyId: string;
}
