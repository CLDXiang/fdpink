import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTeachTableName1640595318763 implements MigrationInterface {
  name = 'AlterTeachTableName1640595318763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`teach_lecture\` (\`instructor_id\` int NOT NULL, \`lecture_id\` int NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`instructor_id\`, \`lecture_id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`teach_lecture\``);
  }
}
