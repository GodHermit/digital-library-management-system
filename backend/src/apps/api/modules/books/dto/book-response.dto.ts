import { ApiProperty } from '@nestjs/swagger';
import { BookEntity } from '../../books/entities/book.entity';
import { GenreResponseDto } from '../../genres/dto/genre-response.dto';
import { PublisherResponseDto } from '../../publishers/dto/publisher-response.dto';
import { UserPublicResponseDto } from '../../users/dto/user-public-response.dto';
import { EReadingStatus } from '../types/reading-status';

export class BookResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  publishedAt: Date;

  @ApiProperty()
  publishedBy: UserPublicResponseDto;

  @ApiProperty({ type: [UserPublicResponseDto] })
  authors: UserPublicResponseDto[];

  @ApiProperty()
  language: string;

  @ApiProperty({ nullable: true })
  coverUrl?: string;

  @ApiProperty()
  priceInETH: number;

  @ApiProperty({ required: false })
  publisher?: PublisherResponseDto;

  @ApiProperty({ type: [GenreResponseDto], isArray: true })
  genres: GenreResponseDto[];

  @ApiProperty({ nullable: true })
  seriesId?: string;

  @ApiProperty({ nullable: true })
  edition?: string;

  @ApiProperty({ nullable: true })
  format?: string;

  @ApiProperty({ enum: EReadingStatus, nullable: true, required: false })
  status?: EReadingStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ nullable: true })
  updatedAt?: Date;

  constructor(entity: BookEntity, status?: EReadingStatus) {
    this.id = entity.id;
    this.title = entity.title;
    this.description = entity.description;
    this.publishedAt = entity.publishedAt;
    if (entity.publishedBy) {
      this.publishedBy = new UserPublicResponseDto(entity.publishedBy);
    }
    if (entity.publisher) {
      this.publisher = new PublisherResponseDto(entity.publisher);
    }
    if (entity.authors) {
      this.authors = entity.authors.map(
        (author) => new UserPublicResponseDto(author),
      );
    }
    this.language = entity.language;
    this.coverUrl = entity.coverUrl;
    this.priceInETH = entity.priceInETH;
    if (entity.genres) {
      this.genres = entity.genres.map((genre) => new GenreResponseDto(genre));
    }
    this.seriesId = entity.seriesId;
    this.edition = entity.edition;
    this.format = entity.format;
    this.status = status || entity.status;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
