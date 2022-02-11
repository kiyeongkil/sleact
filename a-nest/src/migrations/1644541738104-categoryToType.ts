import {MigrationInterface, QueryRunner} from "typeorm";

export class categoryToType1644541738104 implements MigrationInterface {
    name = 'categoryToType1644541738104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` DROP FOREIGN KEY \`FK_77afc26dfe5a8633e6ce35eaa44\``);
        await queryRunner.query(`ALTER TABLE \`channelmembers\` DROP FOREIGN KEY \`FK_e53905ed6170fb65083051881e7\``);
        await queryRunner.query(`DROP INDEX \`IDX_1f3af49b8195937f52d3a66e56\` ON \`workspacemembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_77afc26dfe5a8633e6ce35eaa4\` ON \`workspacemembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_3446cc443ce59a7f7ae62acc16\` ON \`channelmembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_e53905ed6170fb65083051881e\` ON \`channelmembers\``);
        await queryRunner.query(`DROP INDEX \`UserId\` ON \`workspacemembers\``);
        await queryRunner.query(`DROP INDEX \`UserId\` ON \`channelmembers\``);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` DROP COLUMN \`loggedInAt\``);
        await queryRunner.query(`ALTER TABLE \`channelmembers\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`channelmembers\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` ADD \`loggedInAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`channelmembers\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`channelmembers\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE INDEX \`UserId\` ON \`workspacemembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`UserId\` ON \`channelmembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_1f3af49b8195937f52d3a66e56\` ON \`workspacemembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_77afc26dfe5a8633e6ce35eaa4\` ON \`workspacemembers\` (\`WorkspaceId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_3446cc443ce59a7f7ae62acc16\` ON \`channelmembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_e53905ed6170fb65083051881e\` ON \`channelmembers\` (\`ChannelId\`)`);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` ADD CONSTRAINT \`FK_77afc26dfe5a8633e6ce35eaa44\` FOREIGN KEY (\`WorkspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`channelmembers\` ADD CONSTRAINT \`FK_e53905ed6170fb65083051881e7\` FOREIGN KEY (\`ChannelId\`) REFERENCES \`channels\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`channelmembers\` DROP FOREIGN KEY \`FK_e53905ed6170fb65083051881e7\``);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` DROP FOREIGN KEY \`FK_77afc26dfe5a8633e6ce35eaa44\``);
        await queryRunner.query(`DROP INDEX \`IDX_e53905ed6170fb65083051881e\` ON \`channelmembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_3446cc443ce59a7f7ae62acc16\` ON \`channelmembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_77afc26dfe5a8633e6ce35eaa4\` ON \`workspacemembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_1f3af49b8195937f52d3a66e56\` ON \`workspacemembers\``);
        await queryRunner.query(`DROP INDEX \`UserId\` ON \`channelmembers\``);
        await queryRunner.query(`DROP INDEX \`UserId\` ON \`workspacemembers\``);
        await queryRunner.query(`ALTER TABLE \`channelmembers\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`channelmembers\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` DROP COLUMN \`loggedInAt\``);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`channelmembers\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`channelmembers\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` ADD \`loggedInAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE INDEX \`UserId\` ON \`channelmembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`UserId\` ON \`workspacemembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_e53905ed6170fb65083051881e\` ON \`channelmembers\` (\`ChannelId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_3446cc443ce59a7f7ae62acc16\` ON \`channelmembers\` (\`UserId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_77afc26dfe5a8633e6ce35eaa4\` ON \`workspacemembers\` (\`WorkspaceId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_1f3af49b8195937f52d3a66e56\` ON \`workspacemembers\` (\`UserId\`)`);
        await queryRunner.query(`ALTER TABLE \`channelmembers\` ADD CONSTRAINT \`FK_e53905ed6170fb65083051881e7\` FOREIGN KEY (\`ChannelId\`) REFERENCES \`channels\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`workspacemembers\` ADD CONSTRAINT \`FK_77afc26dfe5a8633e6ce35eaa44\` FOREIGN KEY (\`WorkspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
