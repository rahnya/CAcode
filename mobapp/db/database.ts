import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('cacode.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS followed_projects (
        project_id TEXT PRIMARY KEY,
        followed_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS user_preferences (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
  }
  return db;
}

export async function followProject(projectId: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT OR IGNORE INTO followed_projects (project_id, followed_at) VALUES (?, ?)',
    projectId,
    new Date().toISOString()
  );
}

export async function unfollowProject(projectId: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'DELETE FROM followed_projects WHERE project_id = ?',
    projectId
  );
}

export async function getFollowedProjects(): Promise<string[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{ project_id: string }>(
    'SELECT project_id FROM followed_projects ORDER BY followed_at DESC'
  );
  return rows.map((r) => r.project_id);
}

export async function isProjectFollowed(projectId: string): Promise<boolean> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM followed_projects WHERE project_id = ?',
    projectId
  );
  return (row?.cnt ?? 0) > 0;
}

export async function setPreference(key: string, value: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO user_preferences (key, value) VALUES (?, ?)',
    key,
    value
  );
}

export async function getPreference(key: string): Promise<string | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM user_preferences WHERE key = ?',
    key
  );
  return row?.value ?? null;
}
