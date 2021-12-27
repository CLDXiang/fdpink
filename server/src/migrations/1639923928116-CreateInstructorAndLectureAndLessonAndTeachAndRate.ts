import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInstructorAndLectureAndLessonAndTeachAndRate1639923928116 implements MigrationInterface {
  name = 'CreateInstructorAndLectureAndLessonAndTeachAndRate1639923928116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`instructor\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`department\` varchar(64) NOT NULL, \`name\` varchar(64) NOT NULL, UNIQUE INDEX \`uk_name_department\` (\`name\`, \`department\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`lecture\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`code\` varchar(15) NOT NULL, \`taught_by\` varchar(512) NULL, \`name\` varchar(128) NOT NULL, \`category\` varchar(32) NOT NULL, \`semester\` varchar(512) NOT NULL, INDEX \`idx_category\` (\`category\`), UNIQUE INDEX \`uk_code_taught_by\` (\`code\`, \`taught_by\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`lesson\` (\`id\` int NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`code\` varchar(15) NOT NULL, \`code_full\` varchar(20) NOT NULL, \`semester\` varchar(20) NOT NULL, \`category\` varchar(32) NOT NULL, \`taught_by\` varchar(512) NULL, \`name\` varchar(128) NOT NULL, \`credit\` float NOT NULL, \`department\` varchar(30) NOT NULL, \`campus\` varchar(15) NOT NULL, \`remark\` varchar(512) NOT NULL, \`exam_type\` varchar(10) NOT NULL, \`exam_time\` varchar(128) NOT NULL, \`is_edited\` tinyint(1) NOT NULL DEFAULT '0', \`time_slot\` json NOT NULL, \`max_student\` int NOT NULL, INDEX \`idx_code_taught_by\` (\`code\`, \`taught_by\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`rate\` (\`id\` int NOT NULL AUTO_INCREMENT, \`lecture_id\` int NOT NULL, \`user_id\` int NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`is_edited\` tinyint(1) NULL DEFAULT '0', \`is_deleted\` tinyint(1) NULL DEFAULT '0', \`deleted_by\` varchar(100) NULL, \`difficulty\` int NULL, \`workload\` int NULL, \`nice\` int NULL, \`recommended\` int NULL, \`content\` text NULL, INDEX \`idx_user_id\` (\`user_id\`), INDEX \`idx_lecture_id_user_id\` (\`lecture_id\`, \`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`idx_lecture_id_user_id\` ON \`rate\``);
    await queryRunner.query(`DROP INDEX \`idx_user_id\` ON \`rate\``);
    await queryRunner.query(`DROP TABLE \`rate\``);
    await queryRunner.query(`DROP INDEX \`idx_code_taught_by\` ON \`lesson\``);
    await queryRunner.query(`DROP TABLE \`lesson\``);
    await queryRunner.query(`DROP INDEX \`uk_code_taught_by\` ON \`lecture\``);
    await queryRunner.query(`DROP INDEX \`idx_category\` ON \`lecture\``);
    await queryRunner.query(`DROP TABLE \`lecture\``);
    await queryRunner.query(`DROP INDEX \`uk_name_department\` ON \`instructor\``);
    await queryRunner.query(`DROP TABLE \`instructor\``);
  }
}
