import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookStatus1744047294430 implements MigrationInterface {
    name = 'AddBookStatus1744047294430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."book_statuses_status_enum" AS ENUM('want_to_read', 'reading', 'read', 're_reading', 'on_hold', 'dropped', 'plan_to_re_read')`);
        await queryRunner.query(`CREATE TABLE "book_statuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "status" "public"."book_statuses_status_enum" NOT NULL, "book_id" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_6c5364b3069280a1f57e5e056d4" UNIQUE ("book_id", "user_id"), CONSTRAINT "PK_3b04c9c8c44922a05a0c3198766" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "book_statuses" ADD CONSTRAINT "FK_2303bb65a2273312ada9274b37b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_statuses" DROP CONSTRAINT "FK_2303bb65a2273312ada9274b37b"`);
        await queryRunner.query(`DROP TABLE "book_statuses"`);
        await queryRunner.query(`DROP TYPE "public"."book_statuses_status_enum"`);
    }

}
