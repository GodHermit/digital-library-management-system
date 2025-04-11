import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookFiles1744398889289 implements MigrationInterface {
  name = 'AddBookFiles1744398889289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" ADD "fileUrl" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "fileUrl"`);
  }
}
