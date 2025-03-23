import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePaidPriceInETH1742758327822 implements MigrationInterface {
  name = 'RemovePaidPriceInETH1742758327822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "paidPriceInETH"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "paidPriceInETH" double precision`,
    );
  }
}
