import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGenresStatus1746377016306 implements MigrationInterface {
  name = 'AddGenresStatus1746377016306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."genres_status_enum" AS ENUM('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "genres" ADD "status" "public"."genres_status_enum" NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(`ALTER TABLE "genres" ADD "created_by_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "genres" ADD CONSTRAINT "FK_cab0a2f80af246431b215d136b3" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "genres" DROP CONSTRAINT "FK_cab0a2f80af246431b215d136b3"`,
    );
    await queryRunner.query(`ALTER TABLE "genres" DROP COLUMN "created_by_id"`);
    await queryRunner.query(`ALTER TABLE "genres" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."genres_status_enum"`);
  }
}
