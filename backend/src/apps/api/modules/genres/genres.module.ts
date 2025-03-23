import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresRepository } from 'src/common/database/repositories/genres.repository';
import { GenreController } from './genres.controller';
import { BooksRepository } from 'src/common/database/repositories/books.repository';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [GenreController],
  providers: [GenresService, GenresRepository, BooksRepository],
  exports: [GenresService, GenresRepository],
})
export class GenresModule {}
