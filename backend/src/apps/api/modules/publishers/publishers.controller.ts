import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublisherResponseDto } from './dto/publisher-response.dto';
import { PublishersService } from './publishers.service';
import { BearerTokenAuth } from '../auth/decorators/bearer-token-auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@Controller('publishers')
@ApiTags('publishers')
export class PublisherController {
  constructor(private readonly publisherService: PublishersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all publishers' })
  @ApiResponse({ type: PublisherResponseDto, isArray: true })
  async getPublishers(): Promise<PublisherResponseDto[]> {
    const publishers = await this.publisherService.findAll();
    return publishers.map((publisher) => new PublisherResponseDto(publisher));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a publisher by ID' })
  @ApiResponse({ type: PublisherResponseDto })
  async getPublisher(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<PublisherResponseDto> {
    const publisher = await this.publisherService.findOne(id);
    return new PublisherResponseDto(publisher);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new publisher' })
  @ApiResponse({ type: PublisherResponseDto })
  @BearerTokenAuth()
  async createPublisher(
    @Body() dto: CreatePublisherDto,
    @GetUser() user: UserEntity,
  ): Promise<PublisherResponseDto> {
    const publisher = await this.publisherService.create(dto, user);
    return new PublisherResponseDto(publisher);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a publisher by ID' })
  @ApiResponse({ type: PublisherResponseDto })
  @ApiParam({ name: 'id' })
  @BearerTokenAuth()
  async updatePublisher(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePublisherDto,
    @GetUser() user: UserEntity,
  ): Promise<PublisherResponseDto> {
    const publisher = await this.publisherService.update(id, dto, user);
    return new PublisherResponseDto(publisher);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a publisher by ID' })
  @ApiResponse({ type: PublisherResponseDto })
  @BearerTokenAuth()
  async deletePublisher(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: UserEntity,
  ): Promise<PublisherResponseDto> {
    return new PublisherResponseDto(
      await this.publisherService.remove(id, user),
    );
  }
}
