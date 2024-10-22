import pg from 'pg';
import Postgrator from 'postgrator';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

async function migrate() {
  const client = new pg.Client({
    host: 'localhost',
    port: 5432,
    database: 'projetofisica', 
    user: 'docker',
    password: 'docker',
  });

  try {
    await client.connect();

    const postgrator = new Postgrator({
      migrationPattern: path.join(__dirname, '/migrations/*'),
      driver: 'pg',
      database: 'projetofisica',
      schemaTable: 'migrations',
      currentSchema: 'public', // Postgres and MS SQL Server only
      execQuery: (query) => client.query(query),
    });

    console.log(__dirname)

    const result = await postgrator.migrate()

    if (result.length === 0) {
      console.log(
        'No migrations run for schema "public". Already at the latest one.'
      )
    }

    console.log('Migration done.')

    process.exitCode = 0
  } catch(err) {
    console.error(err)
    process.exitCode = 1
  }
  
  await client.end()
}

migrate()