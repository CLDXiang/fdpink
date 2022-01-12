import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryAndLectureIdIdx1641969842713 implements MigrationInterface {
  name = 'AddCategoryAndLectureIdIdx1641969842713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`rate\` ADD \`category\` varchar(32) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`rate\` ADD \`semester\` varchar(10) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`rate\` DROP COLUMN \`deleted_by\``);
    await queryRunner.query(
      `ALTER TABLE \`rate\` ADD \`deleted_by\` enum ('用户本人删除', '管理员删除', '正常') NOT NULL DEFAULT '正常'`,
    );
    await queryRunner.query(`CREATE INDEX \`idx_lecture_id\` ON \`teach_lecture\` (\`lecture_id\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`idx_lecture_id\` ON \`teach_lecture\``);
    await queryRunner.query(`ALTER TABLE \`rate\` DROP COLUMN \`deleted_by\``);
    await queryRunner.query(`ALTER TABLE \`rate\` ADD \`deleted_by\` varchar(100) NULL`);
    await queryRunner.query(`ALTER TABLE \`rate\` DROP COLUMN \`semester\``);
    await queryRunner.query(`ALTER TABLE \`rate\` DROP COLUMN \`category\``);
  }
}
