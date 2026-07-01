const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:root@127.0.0.1:5432/Gram_Setu' });

async function check() {
  await client.connect();
  const res = await client.query('SELECT username, role FROM users');
  console.log('Users in DB:', res.rows);
  await client.end();
}
check();
