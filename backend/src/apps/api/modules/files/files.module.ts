import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.contoler';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, DatabaseModule, AuthModule],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
