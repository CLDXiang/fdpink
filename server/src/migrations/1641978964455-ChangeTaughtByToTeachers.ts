import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeTaughtByToTeachers1641978964455 implements MigrationInterface {
    name = 'ChangeTaughtByToTeachers1641978964455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`uk_code_taught_by\` ON \`lecture\``);
        await queryRunner.query(`DROP INDEX \`idx_code_taught_by\` ON \`lesson\``);
        await queryRunner.query(`ALTER TABLE \`lecture\` CHANGE \`taught_by\` \`teachers\` varchar(512) NULL`);
        await queryRunner.query(`ALTER TABLE \`lesson\` CHANGE \`taught_by\` \`teachers\` varchar(512) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`uk_code_taught_by\` ON \`lecture\` (\`code\`, \`teachers\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_code_taught_by\` ON \`lesson\` (\`code\`, \`teachers\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`idx_code_taught_by\` ON \`lesson\``);
        await queryRunner.query(`DROP INDEX \`uk_code_taught_by\` ON \`lecture\``);
        await queryRunner.query(`ALTER TABLE \`lesson\` CHANGE \`teachers\` \`taught_by\` varchar(512) NULL`);
        await queryRunner.query(`ALTER TABLE \`lecture\` CHANGE \`teachers\` \`taught_by\` varchar(512) NULL`);
        await queryRunner.query(`CREATE INDEX \`idx_code_taught_by\` ON \`lesson\` (\`code\`, \`taught_by\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`uk_code_taught_by\` ON \`lecture\` (\`code\`, \`taught_by\`)`);
    }

}
