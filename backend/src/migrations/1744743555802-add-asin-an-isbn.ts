import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAsinAnIsbn1744743555802 implements MigrationInterface {
  name = 'AddAsinAnIsbn1744743555802';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "books" ADD "asin" character varying`);
    await queryRunner.query(`ALTER TABLE "books" ADD "isbn" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "isbn"`);
    await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "asin"`);
  }
}
