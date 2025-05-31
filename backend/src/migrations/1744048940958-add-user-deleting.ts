import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserDeleting1744048940958 implements MigrationInterface {
  name = 'AddUserDeleting1744048940958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "publishers" DROP CONSTRAINT "FK_d0c4ae74e84403fc0dc45b1d2a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" DROP CONSTRAINT "FK_4ef6f1bca51c8fc53fdfd583098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_0b25595bf35be562f61f42eb41e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_authors" DROP CONSTRAINT "FK_8433d38595493ad358f0cb0a581"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" ALTER COLUMN "ownedByUserId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "publishedByUserId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "orderedByUserId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" ADD CONSTRAINT "FK_d0c4ae74e84403fc0dc45b1d2a8" FOREIGN KEY ("ownedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD CONSTRAINT "FK_4ef6f1bca51c8fc53fdfd583098" FOREIGN KEY ("publishedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_0b25595bf35be562f61f42eb41e" FOREIGN KEY ("orderedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_authors" ADD CONSTRAINT "FK_8433d38595493ad358f0cb0a581" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book_authors" DROP CONSTRAINT "FK_8433d38595493ad358f0cb0a581"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_0b25595bf35be562f61f42eb41e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" DROP CONSTRAINT "FK_4ef6f1bca51c8fc53fdfd583098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" DROP CONSTRAINT "FK_d0c4ae74e84403fc0dc45b1d2a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "orderedByUserId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "publishedByUserId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" ALTER COLUMN "ownedByUserId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_authors" ADD CONSTRAINT "FK_8433d38595493ad358f0cb0a581" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_0b25595bf35be562f61f42eb41e" FOREIGN KEY ("orderedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD CONSTRAINT "FK_4ef6f1bca51c8fc53fdfd583098" FOREIGN KEY ("publishedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" ADD CONSTRAINT "FK_d0c4ae74e84403fc0dc45b1d2a8" FOREIGN KEY ("ownedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
