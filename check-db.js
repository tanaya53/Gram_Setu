const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:root@127.0.0.1:5432/Gram_Setu'
});

async function check() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables found:', res.rows.map(r => r.table_name).join(', '));
  } catch (err) {
    console.error('Error connecting to DB:', err.message);
  } finally {
    await client.end();
  }
}

check();
