import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndMail1639118746881 implements MigrationInterface {
  name = 'CreateUserAndMail1639118746881';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(64) NOT NULL, \`status\` enum ('pending', 'sent', 'activated') NOT NULL DEFAULT 'pending', \`type\` enum ('test', 'activate', 'reset-password', 'reset-mail') NOT NULL DEFAULT 'test', \`code\` varchar(6) NOT NULL, \`requested_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX \`idx_email_status_code\` (\`email\`, \`status\`, \`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NOT NULL, \`email\` varchar(64) NOT NULL, \`saltedPassword\` char(145) NOT NULL, \`nickName\` varchar(30) NULL, \`bio\` varchar(128) NULL, \`role\` enum ('unactivated', 'activated', 'supervisor') NOT NULL DEFAULT 'unactivated', \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX \`idx_nickName\` (\`nickName\`), UNIQUE INDEX \`uk_name\` (\`name\`), UNIQUE INDEX \`uk_email\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`uk_email\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`uk_name\` ON \`user\``);
    await queryRunner.query(`DROP INDEX \`idx_nickName\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP INDEX \`idx_email_status_code\` ON \`mail\``);
    await queryRunner.query(`DROP TABLE \`mail\``);
  }
}
