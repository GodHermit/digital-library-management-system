import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, PaginateQuery } from 'nestjs-paginate';
import { BearerTokenAuth } from '../auth/decorators/bearer-token-auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { BooksLibraryService } from './books-library.service';
import { BOOKS_PAGINATION } from './configs/pagination';
import { BookResponseDto } from './dto/book-response.dto';
import { RemoveStatusDto } from './dto/remove-status.dto';
import { SetStatusDto } from './dto/set-status.dto';
import { EReadingStatus } from './types/reading-status';

@Controller('books-library')
@ApiTags('books / library')
export class BooksLibraryController {
  constructor(private readonly booksLibraryService: BooksLibraryService) {}

  @Get('/@my/:status')
  @ApiOperation({ summary: 'Get all books in library (paginated)' })
  @ApiParam({
    name: 'status',
    enum: EReadingStatus,
    description: 'Status of the book in library',
  })
  @ApiPaginationQuery(BOOKS_PAGINATION)
  @BearerTokenAuth()
  async getMyLibrary(
    @Param() status: EReadingStatus,
    @Query() query: PaginateQuery,
    @GetUser() user: UserEntity,
  ) {
    const data = await this.booksLibraryService.getMyBooks(query, status, user);
    return {
      ...data,
      data: data.data.map((book) => new BookResponseDto(book)),
    };
  }

  @Post('set-status')
  @ApiOperation({ summary: 'Set status of a book in library' })
  @ApiResponse({ type: BookResponseDto })
  @BearerTokenAuth()
  async setStatus(@Body() dto: SetStatusDto, @GetUser() user: UserEntity) {
    const data = await this.booksLibraryService.setStatus(dto, user);
    return new BookResponseDto(data, dto.status);
  }

  @Delete('remove-status')
  @ApiOperation({ summary: 'Remove status of a book in library' })
  @ApiResponse({ type: BookResponseDto })
  @BearerTokenAuth()
  async removeStatus(
    @Body() dto: RemoveStatusDto,
    @GetUser() user: UserEntity,
  ) {
    const data = await this.booksLibraryService.removeStatus(dto, user);
    return new BookResponseDto(data);
  }
}
