import { getDatabase, seedEvaluationItems } from './database';

type EvaluationStatus = 'draft' | 'in_progress' | 'complete' | 'sent';
type TasaTipo = 'asma' | 'epoc' | 'cobertura_vnc';
type CategoriaItem = 'estructura' | 'procesos';

export interface Evaluation {
  id: string;
  establecimiento: string | null;
  status: EvaluationStatus;
  created_at: string;
  updated_at: string;
  fecha: string | null;
  region: string | null;
  comuna: string | null;
  codigo_deis: string | null;
  director: string | null;
  encargado_era: string | null;
  poblacion_rem_p3: number | null;
  horas_administrativas: number | null;
  email_contacto: string | null;
  compromisos: string | null;
}

export interface TasaResultado {
  id: number;
  evaluation_id: string;
  tipo: TasaTipo;
  numerador: number | null;
  denominador: number | null;
}

export interface EvaluacionItem {
  id: number;
  evaluation_id: string;
  item_numero: number;
  categoria: CategoriaItem;
  puntaje: number | null;
  observacion: string | null;
}

export interface SyncQueueEntry {
  id: number;
  evaluation_id: string;
  payload: string;
  created_at: string;
  intentos: number;
}

function nowISO(): string {
  return new Date().toISOString();
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function createEvaluation(): Promise<string> {
  const db = await getDatabase();
  const id = generateUUID();
  const ts = nowISO();
  await db.runAsync(
    `INSERT INTO evaluations (id, status, created_at, updated_at) VALUES (?, 'draft', ?, ?)`,
    [id, ts, ts]
  );
  await seedEvaluationItems(db, id);
  return id;
}

export async function getEvaluation(id: string): Promise<Evaluation | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Evaluation>(
    'SELECT * FROM evaluations WHERE id = ?',
    [id]
  );
  return row ?? null;
}

export async function getAllEvaluations(): Promise<Evaluation[]> {
  const db = await getDatabase();
  return db.getAllAsync<Evaluation>(
    'SELECT * FROM evaluations ORDER BY updated_at DESC'
  );
}

export async function updateEvaluation(
  id: string,
  fields: Partial<Omit<Evaluation, 'id' | 'created_at'>>
): Promise<void> {
  const db = await getDatabase();
  const keys = Object.keys(fields).filter(
    (k) => fields[k as keyof typeof fields] !== undefined
  );
  if (keys.length === 0) return;
  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => fields[k as keyof typeof fields] ?? null);
  await db.runAsync(
    `UPDATE evaluations SET ${setClause}, updated_at = ? WHERE id = ?`,
    [...(values as (string | number | null)[]), nowISO(), id]
  );
}

export async function deleteEvaluation(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM evaluations WHERE id = ?', [id]);
}

export async function getTasas(evaluationId: string): Promise<TasaResultado[]> {
  const db = await getDatabase();
  return db.getAllAsync<TasaResultado>(
    'SELECT * FROM tasas_resultado WHERE evaluation_id = ?',
    [evaluationId]
  );
}

export async function upsertTasa(
  evaluationId: string,
  tipo: TasaTipo,
  numerador: number | null,
  denominador: number | null
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO tasas_resultado (evaluation_id, tipo, numerador, denominador)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(evaluation_id, tipo) DO UPDATE SET numerador = excluded.numerador, denominador = excluded.denominador`,
    [evaluationId, tipo, numerador, denominador]
  );
}

export async function getItems(evaluationId: string): Promise<EvaluacionItem[]> {
  const db = await getDatabase();
  return db.getAllAsync<EvaluacionItem>(
    'SELECT * FROM evaluacion_items WHERE evaluation_id = ? ORDER BY item_numero',
    [evaluationId]
  );
}

export async function updateItemScore(
  evaluationId: string,
  itemNumero: number,
  puntaje: 0 | 1 | null
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE evaluacion_items SET puntaje = ? WHERE evaluation_id = ? AND item_numero = ?',
    [puntaje, evaluationId, itemNumero]
  );
}

export async function updateItemObservation(
  evaluationId: string,
  itemNumero: number,
  observacion: string | null
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE evaluacion_items SET observacion = ? WHERE evaluation_id = ? AND item_numero = ?',
    [observacion, evaluationId, itemNumero]
  );
}

export async function addToSyncQueue(
  evaluationId: string,
  payload: string
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO sync_queue (evaluation_id, payload, created_at) VALUES (?, ?, ?)',
    [evaluationId, payload, nowISO()]
  );
}

export async function getSyncQueue(): Promise<SyncQueueEntry[]> {
  const db = await getDatabase();
  return db.getAllAsync<SyncQueueEntry>(
    'SELECT * FROM sync_queue ORDER BY created_at ASC'
  );
}

export async function removeSyncQueueEntry(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
}

export async function incrementSyncAttempts(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE sync_queue SET intentos = intentos + 1 WHERE id = ?',
    [id]
  );
}

export async function getCompletedItemsCounts(): Promise<Record<string, number>> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ evaluation_id: string; count: number }>(
    `SELECT evaluation_id, COUNT(*) as count
     FROM evaluacion_items
     WHERE puntaje IS NOT NULL
     GROUP BY evaluation_id`
  );
  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.evaluation_id] = row.count;
  }
  return counts;
}
