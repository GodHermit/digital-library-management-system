import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, PaginateQuery } from 'nestjs-paginate';
import { BearerTokenAuth } from '../auth/decorators/bearer-token-auth.decorator';
import { EUserRole } from '../users/types/user.enum';
import { BooksService } from './books.service';
import { BOOKS_PAGINATION } from './configs/pagination';
import { BookResponseDto } from './dto/book-response.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@Controller('books')
@ApiTags('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books (paginated)' })
  @ApiResponse({ type: BookResponseDto, isArray: true })
  @ApiPaginationQuery(BOOKS_PAGINATION)
  async getBooks(@Query() query: PaginateQuery) {
    const books = await this.booksService.findAllWithFilters(query);
    return {
      ...books,
      data: books.data.map((book) => new BookResponseDto(book)),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiResponse({ type: BookResponseDto })
  @ApiParam({ name: 'id' })
  async getBook(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BookResponseDto> {
    return new BookResponseDto(await this.booksService.findOne(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ type: BookResponseDto })
  @BearerTokenAuth(EUserRole.ADMIN)
  async createBook(
    @Body() dto: CreateBookDto,
    @GetUser() user: UserEntity,
  ): Promise<BookResponseDto> {
    return new BookResponseDto(await this.booksService.create(dto, user));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiResponse({ type: BookResponseDto })
  @ApiParam({ name: 'id' })
  @BearerTokenAuth(EUserRole.ADMIN)
  async updateBook(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBookDto,
  ): Promise<BookResponseDto> {
    return new BookResponseDto(await this.booksService.update(id, dto));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiResponse({ type: BookResponseDto })
  @ApiParam({ name: 'id' })
  @BearerTokenAuth(EUserRole.ADMIN)
  async deleteBook(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BookResponseDto> {
    return new BookResponseDto(await this.booksService.remove(id));
  }

  // @Post(':id/like')
  // @ApiOperation({ summary: 'Like a book by ID' })
  // @ApiResponse({ type: BookResponseDto })
  // @ApiParam({ name: 'id' })
  // @BearerTokenAuth()
  // async likeBook(@Param('id') id: string): Promise<BookEntity> {
  //   // Implement the like functionality in the service
  //   return this.booksService.like(id);
  // }

  // @Post(':id/unlike')
  // @ApiOperation({ summary: 'Unlike a book by ID' })
  // @ApiResponse({ type: BookResponseDto })
  // @ApiParam({ name: 'id' })
  // @BearerTokenAuth()
  // async unlikeBook(@Param('id') id: string): Promise<BookEntity> {
  //   // Implement the unlike functionality in the service
  //   return this.booksService.unlike(id);
  // }
}
