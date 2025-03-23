import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { BookEntity } from '../../books/entities/book.entity';
import { GenreResponseDto } from '../../genres/dto/genre-response.dto';
import { PublisherResponseDto } from '../../publishers/dto/publisher-response.dto';
import { UserPublicResponseDto } from '../../users/dto/user-public-response.dto';

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
  publishedBy: UserDto;

  @ApiProperty({ type: [UserDto] })
  authors: UserDto[];

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

  constructor(entity: BookEntity) {
    this.id = entity.id;
    this.title = entity.title;
    this.description = entity.description;
    this.publishedAt = entity.publishedAt;
    this.publishedBy = new UserPublicResponseDto(entity.publishedBy);
    if (entity.publisher) {
      this.publisher = new PublisherResponseDto(entity.publisher);
    }
    this.authors = entity.authors.map(
      (author) => new UserPublicResponseDto(author),
    );
    this.language = entity.language;
    this.coverUrl = entity.coverUrl;
    this.priceInETH = entity.priceInETH;
    this.genres = entity.genres.map((genre) => new GenreResponseDto(genre));
    this.seriesId = entity.seriesId;
    this.edition = entity.edition;
    this.format = entity.format;
  }
}
