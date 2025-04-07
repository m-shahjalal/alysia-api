import dataSource from '../orm-datasource';

async function dropMigrations() {
  try {
    await dataSource.initialize();

    // Drop migrations table
    await dataSource.query('DROP TABLE IF EXISTS migrations');
    console.log('Migrations table dropped successfully');

    // Check for existing tables
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);

    console.log('Existing tables:', tables.map((t) => t.table_name).join(', '));

    // Drop all tables
    for (const table of tables) {
      await dataSource.query(
        `DROP TABLE IF EXISTS "${table.table_name}" CASCADE`,
      );
      console.log(`Dropped table: ${table.table_name}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await dataSource.destroy();
  }
}

dropMigrations();
