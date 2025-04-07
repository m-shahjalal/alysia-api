import { NestFactory } from '@nestjs/core';
import { SeederModule } from '../seeds/seeder.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  try {
    console.info('\n🗑️  CLEANING STARTED\n');

    const dataSource = appContext.get(DataSource);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Disable foreign key constraint checks temporarily
      await queryRunner.query('SET session_replication_role = replica');

      // Get all table names
      const tables = await queryRunner.query(
        'SELECT table_name FROM information_schema.tables WHERE table_schema = CURRENT_SCHEMA();',
      );

      // Truncate each table
      for (const table of tables) {
        const tableName = table.table_name;
        if (tableName !== 'migrations') {
          await queryRunner.query(`TRUNCATE TABLE "${tableName}" CASCADE`);
          console.info(`🪤  Cleaned table: ${tableName}`);
        }
      }

      // Re-enable foreign key constraint checks
      await queryRunner.query('SET session_replication_role = DEFAULT');

      await queryRunner.commitTransaction();
      console.info('\n✅ Database cleanup completed successfully! \n');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  } catch (error) {
    console.info('🚫 Failed to clean database:', error.stack);
    throw error;
  } finally {
    await appContext.close();
  }
}

bootstrap();
