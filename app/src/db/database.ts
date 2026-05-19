import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL, SEED_ITEMS_SQL } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('supervision_era.db');
  await initDatabase(db);
  return db;
}

async function initDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync('PRAGMA journal_mode = WAL;');
  await database.execAsync('PRAGMA foreign_keys = ON;');
  for (const sql of CREATE_TABLES_SQL) {
    await database.execAsync(sql);
  }
}

export function seedEvaluationItems(
  db: SQLite.SQLiteDatabase,
  evaluationId: string
): Promise<void> {
  return db.runAsync(SEED_ITEMS_SQL, [evaluationId]).then(() => {});
}
