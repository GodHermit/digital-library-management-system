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
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreResponseDto } from './dto/genre-response.dto';
import { GenresService } from './genres.service';
import { BearerTokenAuth } from '../auth/decorators/bearer-token-auth.decorator';
import { EUserRole } from '../users/types/user.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { OptionalAuth } from '../auth/decorators/optional-auth.decorator';

@Controller('genres')
@ApiTags('genres')
export class GenreController {
  constructor(private readonly genreService: GenresService) {}

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ type: GenreResponseDto, isArray: true })
  @OptionalAuth()
  @BearerTokenAuth()
  async getGenres(@GetUser() user: UserEntity): Promise<GenreResponseDto[]> {
    const genres = await this.genreService.findAll(user);
    return genres.map((genre) => new GenreResponseDto(genre));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a genre by ID' })
  @ApiResponse({ type: GenreResponseDto })
  @OptionalAuth()
  @BearerTokenAuth()
  async getGenre(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: UserEntity,
  ): Promise<GenreResponseDto> {
    const genre = await this.genreService.findOne(id, user);
    return new GenreResponseDto(genre);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new genre',
  })
  @ApiResponse({ type: GenreResponseDto })
  @BearerTokenAuth()
  async createGenre(
    @Body() dto: CreateGenreDto,
    @GetUser() user: UserEntity,
  ): Promise<GenreResponseDto> {
    const genre = await this.genreService.create(dto, user);
    return new GenreResponseDto(genre);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a genre by ID' })
  @ApiResponse({ type: GenreResponseDto })
  @ApiParam({ name: 'id' })
  @BearerTokenAuth(EUserRole.ADMIN)
  async updateGenre(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateGenreDto,
  ): Promise<GenreResponseDto> {
    const genre = await this.genreService.update(id, dto);
    return new GenreResponseDto(genre);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a genre by ID' })
  @ApiResponse({ type: GenreResponseDto })
  @BearerTokenAuth(EUserRole.ADMIN)
  async deleteGenre(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<GenreResponseDto> {
    return new GenreResponseDto(await this.genreService.remove(id));
  }
}
