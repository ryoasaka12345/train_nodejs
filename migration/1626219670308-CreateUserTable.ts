import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1626219670308 implements MigrationInterface {
	//All database operations are executed using QueryRunner

	// contain the code you need to perform the migration.
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`users\` (
                \`id\` INT NOT NULL AUTO_INCREMENT,
                \`email\` VARCHAR(45) NOT NULL,
                \`password\` VARCHAR(45) NOT NULL,
                \`name\` VARCHAR(45) NOT NULL,
                \`profession\` VARCHAR(45) NULL,
                PRIMARY KEY (\`id\`)
                );`
		);
	}

	// used to revert last migration
	public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE IF EXISTS users;`);
    }
}
