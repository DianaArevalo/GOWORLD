import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';


const { DATABASE_URL } = process.env;

const sql = neon(DATABASE_URL!);
const db = drizzle(sql, { schema });

export default db;