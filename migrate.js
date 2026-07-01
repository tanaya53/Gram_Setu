const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:root@127.0.0.1:5432/Gram_Setu'
});

async function migrate() {
  try {
    await client.connect();
    console.log('Connected to database.');

    // Check if table 'schemes' exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'schemes'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('Schemes table exists. Checking active column...');
      
      // Check if 'active' column exists
      const columnCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name='schemes' AND column_name='active'
        );
      `);

      if (!columnCheck.rows[0].exists) {
        console.log('Adding active column to schemes table...');
        await client.query(`
          ALTER TABLE schemes ADD COLUMN active boolean DEFAULT true;
        `);
        console.log('Column active added successfully.');
      } else {
        console.log('active column already exists.');
      }

      // Update any null active values to true
      const updateResult = await client.query(`
        UPDATE schemes SET active = true WHERE active IS NULL;
      `);
      console.log(`Updated ${updateResult.rowCount} legacy scheme rows to active = true.`);
    } else {
      console.log('Schemes table does not exist yet. It will be created by Hibernate.');
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
