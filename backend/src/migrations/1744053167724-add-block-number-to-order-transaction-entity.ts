import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlockNumberToOrderTransactionEntity1744053167724
  implements MigrationInterface
{
  name = 'AddBlockNumberToOrderTransactionEntity1744053167724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_transactions" ADD "blockNumber" bigint NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_transactions" DROP COLUMN "blockNumber"`,
    );
  }
}
