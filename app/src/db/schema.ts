export const CREATE_TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS evaluations (
    id TEXT PRIMARY KEY,
    establecimiento TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','in_progress','complete','sent')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    fecha TEXT,
    region TEXT,
    comuna TEXT,
    codigo_deis TEXT,
    director TEXT,
    encargado_era TEXT,
    poblacion_rem_p3 INTEGER,
    horas_administrativas INTEGER,
    email_contacto TEXT,
    compromisos TEXT,
    email_destinatario TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS tasas_resultado (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evaluation_id TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('asma','epoc','cobertura_vnc')),
    numerador INTEGER,
    denominador INTEGER,
    UNIQUE(evaluation_id, tipo),
    FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS evaluacion_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evaluation_id TEXT NOT NULL,
    item_numero INTEGER NOT NULL,
    categoria TEXT NOT NULL CHECK(categoria IN ('estructura','procesos')),
    puntaje INTEGER CHECK(puntaje IN (0, 1)),
    observacion TEXT,
    FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evaluation_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    intentos INTEGER DEFAULT 0,
    FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE
  );`,
];

export const SEED_ITEMS_SQL = `
  INSERT OR IGNORE INTO evaluacion_items (evaluation_id, item_numero, categoria)
  SELECT ?, item_numero, categoria FROM (
    SELECT 1 as item_numero, 'estructura' as categoria UNION
    SELECT 2, 'estructura' UNION SELECT 3, 'estructura' UNION SELECT 4, 'estructura' UNION
    SELECT 5, 'estructura' UNION SELECT 6, 'estructura' UNION SELECT 7, 'estructura' UNION
    SELECT 8, 'estructura' UNION SELECT 9, 'estructura' UNION SELECT 10, 'estructura' UNION
    SELECT 11, 'estructura' UNION SELECT 12, 'estructura' UNION
    SELECT 13, 'procesos' UNION SELECT 14, 'procesos' UNION SELECT 15, 'procesos' UNION
    SELECT 16, 'procesos' UNION SELECT 17, 'procesos' UNION SELECT 18, 'procesos' UNION
    SELECT 19, 'procesos' UNION SELECT 20, 'procesos' UNION SELECT 21, 'procesos' UNION
    SELECT 22, 'procesos' UNION SELECT 23, 'procesos' UNION SELECT 24, 'procesos' UNION
    SELECT 25, 'procesos' UNION SELECT 26, 'procesos' UNION SELECT 27, 'procesos' UNION
    SELECT 28, 'procesos' UNION SELECT 29, 'procesos' UNION SELECT 30, 'procesos' UNION
    SELECT 31, 'procesos' UNION SELECT 32, 'procesos' UNION SELECT 33, 'procesos'
  );
`;
