import { Module } from '@nestjs/common';

const REPOSITORIES = [];

@Module({
  providers: REPOSITORIES,
  exports: REPOSITORIES,
})
export class DatabaseModule {}
