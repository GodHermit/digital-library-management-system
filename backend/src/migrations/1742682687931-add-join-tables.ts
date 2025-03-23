import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJoinTables1742682687931 implements MigrationInterface {
  name = 'AddJoinTables1742682687931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "book_authors" ("bookId" uuid NOT NULL, "authorId" uuid NOT NULL, CONSTRAINT "PK_167ae201537b9bc226186c57a36" PRIMARY KEY ("bookId", "authorId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8433d38595493ad358f0cb0a58" ON "book_authors" ("bookId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7afd39332b56e49bdfdf8046ef" ON "book_authors" ("authorId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "book_genres" ("bookId" uuid NOT NULL, "genreId" uuid NOT NULL, CONSTRAINT "PK_38b19168b3ad81851b5596cb633" PRIMARY KEY ("bookId", "genreId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d7277e26c03e07fe1ad1dd315" ON "book_genres" ("bookId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_346e0792ef07fd64c9faf856a5" ON "book_genres" ("genreId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "book_authors" ADD CONSTRAINT "FK_8433d38595493ad358f0cb0a581" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_authors" ADD CONSTRAINT "FK_7afd39332b56e49bdfdf8046ef2" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genres" ADD CONSTRAINT "FK_3d7277e26c03e07fe1ad1dd315f" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genres" ADD CONSTRAINT "FK_346e0792ef07fd64c9faf856a56" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book_genres" DROP CONSTRAINT "FK_346e0792ef07fd64c9faf856a56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_genres" DROP CONSTRAINT "FK_3d7277e26c03e07fe1ad1dd315f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_authors" DROP CONSTRAINT "FK_7afd39332b56e49bdfdf8046ef2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_authors" DROP CONSTRAINT "FK_8433d38595493ad358f0cb0a581"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_346e0792ef07fd64c9faf856a5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d7277e26c03e07fe1ad1dd315"`,
    );
    await queryRunner.query(`DROP TABLE "book_genres"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7afd39332b56e49bdfdf8046ef"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8433d38595493ad358f0cb0a58"`,
    );
    await queryRunner.query(`DROP TABLE "book_authors"`);
  }
}
