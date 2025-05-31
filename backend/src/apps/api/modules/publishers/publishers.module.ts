import { forwardRef, Module } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { BooksRepository } from 'src/common/database/repositories/books.repository';
import { PublisherController } from './publishers.controller';
import { PublishersRepository } from 'src/common/database/repositories/publishers.repository';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => UsersModule), AuthModule],
  controllers: [PublisherController],
  providers: [PublishersService, PublishersRepository, BooksRepository],
  exports: [PublishersService, PublishersRepository],
})
export class PublishersModule {}
