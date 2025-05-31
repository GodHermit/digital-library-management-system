import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderItemsTransactions1742941890558
  implements MigrationInterface
{
  name = 'AddOrderItemsTransactions1742941890558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order_item_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "itemId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "receiverType" character varying NOT NULL, "receiverId" uuid NOT NULL, "receiver" character varying NOT NULL, "valueInEth" double precision NOT NULL, "hash" character varying, CONSTRAINT "PK_5e6cc2c19a768779cd05948e889" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" ADD "ownedByUserId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" ADD CONSTRAINT "UQ_d0c4ae74e84403fc0dc45b1d2a8" UNIQUE ("ownedByUserId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" DROP CONSTRAINT "FK_594ad92cc478a33e51fd0e31bf3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "publisherId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" ADD CONSTRAINT "FK_d0c4ae74e84403fc0dc45b1d2a8" FOREIGN KEY ("ownedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD CONSTRAINT "FK_594ad92cc478a33e51fd0e31bf3" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_transactions" ADD CONSTRAINT "FK_ecb7a2e0cea95a98d6480e5100b" FOREIGN KEY ("itemId") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item_transactions" DROP CONSTRAINT "FK_ecb7a2e0cea95a98d6480e5100b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" DROP CONSTRAINT "FK_594ad92cc478a33e51fd0e31bf3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" DROP CONSTRAINT "FK_d0c4ae74e84403fc0dc45b1d2a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "publisherId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD CONSTRAINT "FK_594ad92cc478a33e51fd0e31bf3" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" DROP CONSTRAINT "UQ_d0c4ae74e84403fc0dc45b1d2a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "publishers" DROP COLUMN "ownedByUserId"`,
    );
    await queryRunner.query(`DROP TABLE "order_item_transactions"`);
  }
}
