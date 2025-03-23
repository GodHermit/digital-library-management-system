import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrders1742758077971 implements MigrationInterface {
  name = 'AddOrders1742758077971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_44fba34a7052127480dde32f290"`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "orderId" uuid NOT NULL, "bookId" uuid NOT NULL, "priceInETH" double precision NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "orderId" uuid NOT NULL, "txHash" character varying NOT NULL, "valueInEth" double precision NOT NULL, CONSTRAINT "PK_a3f432d56165e5acafd5fb17cb3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "orderTxHash"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "bookId"`);
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_0101724ac3b11e85922928ab86e" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_6f0b1f6dd3ac763cbfe1df9d69b" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_6f0b1f6dd3ac763cbfe1df9d69b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_0101724ac3b11e85922928ab86e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" ADD "bookId" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "orderTxHash" character varying`,
    );
    await queryRunner.query(`DROP TABLE "order_transactions"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_44fba34a7052127480dde32f290" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
