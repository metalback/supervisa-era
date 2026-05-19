# PRD: Supervisión Sala ERA — MVP Monousuario

## Problem Statement

Un referente técnico del programa de salud respiratoria del MINSAL necesita realizar supervisiones en terreno a establecimientos de Atención Primaria (CESFAM, CECOSF) que cuentan con Sala ERA. Actualmente el proceso es manual: el referente imprime la pauta oficial en Excel, la completa a mano durante la visita, y luego transcribe los datos a la planilla digital. Esto ocurre frecuentemente en zonas rurales sin conectividad, con riesgo de pérdida de datos y sin posibilidad de generar el informe Excel oficial de forma inmediata.

No existe una herramienta móvil offline-first que permita capturar los 33 indicadores de la pauta, precargar los datos de resultado (tasas DEIS/Tableau) y automatizar la inyección de datos en la planilla Excel oficial respetando sus fórmulas nativas.

## Solution

Aplicación móvil (React Native / Expo) con persistencia local-first (SQLite) que guía al referente a través de 5 pantallas secuenciales para completar la Pauta de Monitoreo y Supervisión del Proceso de Atención de Salud Respiratoria en Sala ERA. Un backend liviano (FastAPI + openpyxl) recibe el JSON completo y lo inyecta en la planilla Excel oficial, preservando todas sus fórmulas y macros. El archivo resultante se descarga al dispositivo para que el usuario lo comparta por el medio que prefiera (WhatsApp, correo, Drive).

El sistema opera 100% offline durante la captura; solo requiere conectividad para enviar los datos al backend y generar el Excel.

## User Stories

1. Como referente técnico, quiero que la aplicación se abra con un PIN de seguridad, para que los datos sensibles de supervisión estén protegidos en caso de pérdida o robo del dispositivo.
2. Como referente, quiero ver una lista de mis evaluaciones previas en el Home, para tener visibilidad del historial de supervisiones realizadas.
3. Como referente, quiero crear una nueva evaluación desde el Home con un botón destacado, para iniciar rápidamente una visita en terreno.
4. Como referente, quiero que cada evaluación tenga un estado visible (Borrador, En Progreso, Completa, Enviada), para saber en qué etapa se encuentra cada supervisión.
5. Como referente, quiero ver el avance de cada evaluación (ej. "14/33 ítems"), para priorizar las que están incompletas.
6. Como referente, quiero ingresar los datos de identificación del establecimiento (región, comuna, nombre, código DEIS, director, encargado ERA, población REM P3, horas administrativas, email), para asociar la evaluación a un centro de salud específico.
7. Como referente, quiero que la fecha se autocomplete con la fecha actual del sistema, para evitar errores de digitación.
8. Como referente, quiero seleccionar región y comuna desde dropdowns predefinidos, para estandarizar los datos geográficos.
9. Como referente, quiero precargar los indicadores de resultado (numerador/denominador de tasas de Asma, EPOC y Coberturas), para que la planilla Excel los procese con sus fórmulas nativas.
10. Como referente, quiero una pantalla de evaluación dividida en dos pestañas (Estructura: ítems 1-12, Procesos: ítems 13-33), para navegar entre secciones de la pauta.
11. Como referente, quiero un selector binario (Sí/No) para cada indicador, para registrar rápidamente el cumplimiento en terreno.
12. Como referente, quiero poder agregar observaciones opcionales expandibles a cada ítem, para registrar verificadores, números de serie, fechas de convenios, etc.
13. Como referente, quiero que cada cambio en los selectores y observaciones se guarde automáticamente en SQLite, para no perder datos si el dispositivo se apaga.
14. Como referente, quiero ver una barra de progreso general durante la evaluación, para saber cuántos ítems llevo completados.
15. Como referente, quiero un resumen al final con establecimiento, ítems revisados y observaciones principales, para confirmar los datos antes de generar el Excel.
16. Como referente, quiero agregar compromisos y plan de trabajo en un campo de texto amplio, para documentar los acuerdos con el equipo del establecimiento.
17. Como referente, quiero generar la planilla Excel oficial con un solo botón, para obtener el informe listo para compartir.
18. Como referente, quiero que la generación del Excel funcione sin conexión (quedando pendiente para envío posterior), para usarla en zonas sin internet.
19. Como referente, quiero que la app detecte cuando hay conectividad y reintente el envío automáticamente, para minimizar la operación manual.
20. Como referente, quiero descargar el Excel generado al almacenamiento del dispositivo, para compartirlo por WhatsApp, correo o Drive según prefiera.
21. Como referente, quiero que los datos de la evaluación no se pierdan si cambio de pantalla o cierro la app, gracias al autosave persistente.
22. Como referente, quiero navegar entre secciones de la evaluación mediante una bottom nav, para saltar directamente a la sección que necesito sin pasar pantalla por pantalla.
23. Como referente, quiero que la interfaz tenga una apariencia institucional profesional (azul MINSAL, tipografía Inter), para que sea reconocible como herramienta oficial.

## Implementation Decisions

### Arquitectura General
- Monorepo con `app/` (React Native / Expo) y `api/` (FastAPI + openpyxl).
- Backend desplegado en Docker en homelab del desarrollador.
- Comunicación app↔backend vía API REST (JSON → endpoint → archivo binario).

### Módulos de la App (`app/`)

1. **Theme Module** (`app/src/theme/`): Tokens de diseño basados en el DESIGN.md (colores institucionales, tipografía Inter, espaciado 8px grid, border-radius, elevation). Implementado como constantes de TypeScript exportadas.

2. **Auth Module** (`app/src/store/auth.ts`): PIN de 4 dígitos guardado en SecureStore via `expo-secure-store`. Verificación al abrir la app. Primera ejecución: solicita crear PIN. Ejecuciones siguientes: solicita ingresar PIN.

3. **Database Layer** (`app/src/db/`): SQLite via `expo-sqlite`. Tablas:
   - `evaluations`: id (TEXT UUID), establecimiento (TEXT), status (TEXT: draft|in_progress|complete|sent), created_at (TEXT), updated_at (TEXT), fecha (TEXT), region (TEXT), comuna (TEXT), codigo_deis (TEXT), director (TEXT), encargado_era (TEXT), poblacion_rem_p3 (INTEGER), horas_administrativas (INTEGER), email_contacto (TEXT), compromisos (TEXT), email_destinatario (TEXT), remoto_id (TEXT NULL for sync), ultima_sincronizacion (TEXT NULL).
   - `tasas_resultado`: id (INTEGER PK), evaluation_id (TEXT FK), tipo (TEXT: asma|epoc|cobertura_vnc), numerador (INTEGER), denominador (INTEGER).
   - `evaluacion_items`: id (INTEGER PK), evaluation_id (TEXT FK), item_numero (INTEGER), categoria (TEXT: estructura|procesos), puntaje (INTEGER: 0|1), observacion (TEXT NULL).
   - `sync_queue`: id (INTEGER PK), evaluation_id (TEXT FK), payload (TEXT JSON), created_at (TEXT), intentos (INTEGER DEFAULT 0).

4. **State Management** (`app/src/store/evaluation.ts`): Zustand store con middleware `persist` (AsyncStorage). Refleja el estado activo de la evaluación en curso. Operaciones: `createEvaluation()`, `saveMetadata()`, `saveTasas()`, `saveItemScore()`, `saveItemObservation()`, `saveCompromisos()`, `generateExcel()`, `loadEvaluation(id)`.

5. **Screens** (`app/src/screens/`):
   - `HomeScreen`: Lista de evaluaciones con tarjetas (nombre, tipo, estado, progreso). FAB "+ Nueva Evaluación". Filtro por estado.
   - `IdentificationScreen`: Formulario de identificación del establecimiento. Campos: fecha (auto), código DEIS, región (dropdown), comuna (dropdown), establecimiento, director, encargado ERA, población REM P3, horas administrativas, email.
   - `ResultadosScreen`: Tres bloques (Asma, EPOC, Coberturas) con campos numerador/denominador.
   - `EvaluationScreen`: Tabs Estructura (ítems 1-12) / Procesos (ítems 13-33). Cada ítem con título, selector binario, observación expandible.
   - `ClosureScreen`: Resumen, compromisos y botón de generar Excel.

6. **Components** (`app/src/components/`):
   - `StatusCard`: Tarjeta de evaluación en Home (nombre, tipo, estado, progreso, barra de progreso, barra de color lateral).
   - `BinarySelector`: Segmented control Sí(1)/No(0) con estilos de estado activo.
   - `ObservationField`: Textarea colapsable con toggle.
   - `ProgressBar`: Barra de progreso horizontal con etiqueta.
   - `StatusChip`: Badge de estado (En Progreso, Completa, Enviada, Pendiente).
   - `FormInput`: Input con label flotante y estilo institucional.
   - `SectionCard`: Card con encabezado e ícono para agrupar secciones.
   - `BottomNav`: Bottom navigation bar con 5 tabs (Identificación, Resultados, Estructura, Procesos, Cierre).
   - `SyncBanner`: Banner de conectividad online/offline.

### Módulos del Backend (`api/`)

7. **Excel Injection Service** (`api/services/injector.py`): Recibe JSON validado, carga la plantilla Excel con openpyxl (data_only=False para preservar fórmulas), escribe valores en las coordenadas mapeadas. Mapa de celdas documentado en código como constantes. Prohibido calcular sumatorias, porcentajes o clasificaciones — solo inyecta valores.

8. **Cell Mapping** (`api/services/cell_mapping.py`): Diccionario que mapea cada campo del JSON a su celda en PAUTA_ERA. Ejemplo:
   - `metadata.establecimiento` → A10 (celda mergeada A10:J10)
   - `tasas_resultado.asma.numerador` → G23, denominador → H23
   - `evaluacion.estructura[0].puntaje` → C34 (item 1)
   - `evaluacion.procesos[0].puntaje` → C52 (item 13)
   - `cierre.compromisos` → A97

9. **Routes** (`api/app/routes.py`):
   - `POST /generate`: Recibe JSON, llama al injector, devuelve el Excel como `Response` con `media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"`.
   - `GET /health`: Healthcheck para Docker.
   - Schema Pydantic (`api/app/models.py`): `EvaluacionRequest` con metada, tasas_resultado, evaluacion (estructura + procesos), cierre.

10. **Docker** (`api/Dockerfile`): Python 3.12 slim, dependencias (fastapi, uvicorn, openpyxl, python-multipart). `docker-compose.yml` con servicio API expuesto en puerto 8000.

### Flujo de Generación de Excel
1. App construye JSON con toda la evaluación.
2. App verifica conectividad. Si hay: POST /generate → recibe archivo binario → guarda en FileSystem (Downloads) → muestra opción "Abrir con...". Si no hay: guarda en sync_queue, marca como "Pendiente de Envío", reintenta automaticamente al recuperar conexión.
3. Backend recibe JSON → valida con Pydantic → carga plantilla_base.xlsx → inyecta valores según cell_mapping → guarda en BytesIO → devuelve como Response con nombre dinámico "PAUTA_ERA_{establecimiento}_{fecha}.xlsx".
4. App ofrece el archivo nativamente: `expo-file-system` + `expo-sharing` o `expo-intent-launcher` para abrir con la app de archivos.

### Sync / Offline
- Network state monitoreado con `@react-native-community/netinfo`.
- `sync_queue` en SQLite almacena los payloads pendientes.
- NetInfo listener: al reconectarse, drena sync_queue en orden FIFO.
- Cada item en sync_queue tiene contador de intentos (max 3).

## Testing Decisions

### Filosofía
Solo se testea comportamiento externo, no implementación interna. Un test pasa si el output esperado es correcto para un input dado, no si se llamaron ciertas funciones internas o se siguieron ciertos pasos.

### Backend Tests (pytest)
- **`test_injector.py`**: Test de integración sobre el Excel Injection Service. Carga la plantilla, inyecta un JSON conocido, verifica que las celdas tengan los valores correctos. Verifica que las fórmulas NO se sobrescriban (leer celda de fórmula después de inyección debe retornar `=G23/H23*10000` no un valor estático).
- **`test_routes.py`**: Test de API con TestClient de FastAPI. POST /generate con JSON válido → status 200, Content-Type correcto, archivo descargable.
- Prior art: Tests existentes en NexoEstado (FastAPI + pytest).

### Frontend Tests (Jest + React Native Testing Library)
- **Store tests**: Test de Zustand store operations. Crear evaluación, modificar items, verificar persistencia del estado. Sin mock de SQLite — testear la lógica del store.
- **Component tests**: BinarySelector (renderiza ambos botones, click cambia estado visual), StatusCard (renderiza nombre, estado, progreso), ObservationField (toggle expandir/colapsar).
- **Screen integration test**: IdentificationScreen renderiza todos los campos del formulario.
- Mock de `expo-sqlite` y `expo-secure-store` a nivel de módulo.
- Prior art: Pruebas existentes en BeerQuest (React Native).

## Out of Scope

- Autenticación contra API (por ahora es monousuario y el backend solo acepta conexiones de la app localmente o en la LAN).
- SMTP / envío automático de correo: el usuario comparte el archivo manualmente.
- Roles de usuario multi-tenant: solo un referente técnico.
- Dashboard o analytics web: la planilla Excel es el producto final.
- Migraciones complejas de SQLite: schema version (manual) con migraciones inline.
- CI/CD pipelines: por ahora build local con EAS.
- Traducción a otros idiomas.
- Soporte para tablets o desktop: solo mobile portrait.
- Notificaciones push.
- Cálculo de tasas: la app solo captura numerador y denominador, la planilla Excel hace el cálculo con sus fórmulas.

## Acceptance Criteria

### Core Infrastructure
- [ ] App opens with PIN security (User Story #1)
- [ ] Theme matches institutional design: MINSAL blue, Inter typography (User Story #23)
- [ ] SQLite database created on first launch with all tables
- [ ] Backend healthcheck returns 200 OK

### Home & Navigation
- [ ] Home screen shows list of evaluations with status cards (User Story #2)
- [ ] FAB creates new evaluation and navigates to Identification (User Story #3)
- [ ] Evaluations have visible status: Borrador, En Progreso, Completa, Enviada (User Story #4)
- [ ] Progress indicator shows item count (e.g. "14/33 ítems") (User Story #5)
- [ ] Bottom navigation allows jumping between sections (User Story #22)

### Data Capture
- [ ] Identification form captures all establishment fields (User Story #6)
- [ ] Date auto-fills with current system date (User Story #7)
- [ ] Region and comuna use predefined dropdowns (User Story #8)
- [ ] Resultados screen captures numerador/denominador for Asma, EPOC, Coberturas (User Story #9)
- [ ] Evaluation screen has Estructura (1-12) and Procesos (13-33) tabs (User Story #10)
- [ ] Binary selector (Sí/No) works for each indicator (User Story #11)
- [ ] Expandible observation field available for each item (User Story #12)
- [ ] Auto-save on every change to SQLite (User Story #13)
- [ ] Progress bar shows completion during evaluation (User Story #14)

### Closure & Excel Generation
- [ ] Summary screen shows establishment, items reviewed, main observations (User Story #15)
- [ ] Compromisos text field available for work plan (User Story #16)
- [ ] Single button generates official Excel (User Story #17)
- [ ] Excel generation works offline (queued for later send) (User Story #18)
- [ ] App detects connectivity and retries automatically (User Story #19)
- [ ] Excel downloads to device storage for sharing (User Story #20)
- [ ] Data persists across screen changes and app restarts (User Story #21)

### Backend
- [ ] POST /generate accepts JSON and returns correct Content-Type
- [ ] Excel has correct values in all mapped cells
- [ ] Formulas preserved after injection (I23, I24, I25, C81, C82, D81, D82, F81, F82, I81, I82)
- [ ] Invalid JSON returns 422 validation error
- [ ] Docker build succeeds and container starts

## Implementation Progress

| Issue | Title | Status |
|-------|-------|--------|
| #2 | Backend: Skeleton + Excel Injection Service | Done |
| #3 | App Scaffold + Auth PIN | Done |
| #4 | Home Screen + Database Layer + Evaluation Store | Pending |
| #5 | Identification Screen | Pending |
| #6 | Resultados Screen | Pending |
| #7 | Evaluation Screen (Estructura + Procesos) | Pending |
| #8 | Closure Screen + Excel Generation + Offline Sync | Pending |
| #9 | End-to-End Flow + Bottom Navigation + Evaluation States | Pending |
| #10 | Backend Tests: Excel Injection + API Routes | Pending |
| #11 | Frontend Tests: Components + Store + Screens | Pending |

## Further Notes

- La plantilla Excel debe distribuirse con la app o descargarse del backend. Propuesta: incluir `plantilla_base.xlsx` en el repositorio de `api/templates/`. Si la plantilla oficial se actualiza, se reemplaza el archivo y se actualiza el cell_mapping si es necesario.
- El diseño UI está completamente especificado en `designs/stitch_supervisi_n_sala_era_mvp/` (5 screens en HTML + DESIGN.md con tokens). La implementación React Native debe seguir fielmente estos diseños.
- La app usa Material Symbols (íconos) que tienen equivalents en React Native via `@expo/vector-icons` (MaterialCommunityIcons) o `react-native-vector-icons`.
- Los enunciados oficiales de los 33 indicadores están en la columna B de la hoja PAUTA_ERA. Para la app se usarán versiones resumidas extraídas de ahí, con el texto completo del verificador (columna F) como contenido expandible.
