export interface EvaluationItemData {
  itemNumero: number;
  categoria: 'estructura' | 'procesos';
  label: string;
}

export const EVALUATION_ITEMS: EvaluationItemData[] = [
  {
    itemNumero: 1,
    categoria: 'estructura',
    label: 'Horas profesionales destinadas a la atención de personas con condiciones de salud respiratoria.',
  },
  {
    itemNumero: 2,
    categoria: 'estructura',
    label: 'Profesionales que realizan atención de personas con condiciones de salud respiratoria, ¿tienen capacitación formal y vigente para el abordaje de personas con enfermedades respiratorias del adulto?',
  },
  {
    itemNumero: 3,
    categoria: 'estructura',
    label: 'Box de uso exclusivo para la atención de personas con condiciones de salud respiratoria.',
  },
  {
    itemNumero: 4,
    categoria: 'estructura',
    label: 'Acceso a examen radiológico (ininterrumpido durante los últimos 12 meses).',
  },
  {
    itemNumero: 5,
    categoria: 'estructura',
    label: 'Disponibilidad de espirómetro e insumos para la realización del procedimiento.',
  },
  {
    itemNumero: 6,
    categoria: 'estructura',
    label: 'Disponibilidad de flujómetro e insumos para la realización del procedimiento.',
  },
  {
    itemNumero: 7,
    categoria: 'estructura',
    label: 'Disponibilidad de oxigenoterapia e insumos para la realización del procedimiento.',
  },
  {
    itemNumero: 8,
    categoria: 'estructura',
    label: 'Disponibilidad de sistema de aspiración de secreciones e insumos para la realización del procedimiento.',
  },
  {
    itemNumero: 9,
    categoria: 'estructura',
    label: 'Disponibilidad de insumos para ejecutar programa de rehabilitación pulmonar.',
  },
  {
    itemNumero: 10,
    categoria: 'estructura',
    label: 'Disponibilidad de infraestructura para ejecutar programa de rehabilitación pulmonar.',
  },
  {
    itemNumero: 11,
    categoria: 'estructura',
    label: 'Disponibilidad de fármacos e insumos para sala ERA incorporados en el Programa de Adquisición y Gestión de Medicamentos e Insumos para Programas Ministeriales de Atención Primaria de Salud vigente.',
  },
  {
    itemNumero: 12,
    categoria: 'estructura',
    label: 'Dispone de sistema para la confirmación de citas con anticipación.',
  },
  {
    itemNumero: 13,
    categoria: 'procesos',
    label: 'Protocolo vigente del establecimiento para la gestión de insumos de farmacia que incluya fármacos de sala ERA.',
  },
  {
    itemNumero: 14,
    categoria: 'procesos',
    label: 'Protocolo vigente del establecimiento para la mantención y reposición de equipos, que incluya dispositivos utilizados en sala ERA.',
  },
  {
    itemNumero: 15,
    categoria: 'procesos',
    label: 'Protocolo vigente para la referencia y contrarreferencia con los niveles 2º/3º de atención.',
  },
  {
    itemNumero: 16,
    categoria: 'procesos',
    label: 'Protocolo de derivación local vigente desde y hacia el programa.',
  },
  {
    itemNumero: 17,
    categoria: 'procesos',
    label: 'Protocolo local vigente para el rescate de inasistentes/personas que abandonan el programa.',
  },
  {
    itemNumero: 18,
    categoria: 'procesos',
    label: 'Los profesionales aplican protocolo vigente para la identificación, registro y abordaje de reacciones adversas a medicamentos (RAM).',
  },
  {
    itemNumero: 19,
    categoria: 'procesos',
    label: 'El establecimiento resguarda la seguridad de la atención en la aplicación de kinesioterapia respiratoria.',
  },
  {
    itemNumero: 20,
    categoria: 'procesos',
    label: 'Manual de inducción elaborado y validado por el equipo de salud respiratorio local para referentes y profesionales que se incorporan al equipo.',
  },
  {
    itemNumero: 21,
    categoria: 'procesos',
    label: 'El establecimiento programa y evalúa actividades propuestas para el año en curso.',
  },
  {
    itemNumero: 22,
    categoria: 'procesos',
    label: 'El establecimiento incorpora en el programa anual de capacitación, temáticas conducentes a fortalecer las competencias técnicas del equipo ERA.',
  },
  {
    itemNumero: 23,
    categoria: 'procesos',
    label: 'El establecimiento dispone de programa de capacitación con nivel secundario/hospital referente para profesionales del programa ERA de APS.',
  },
  {
    itemNumero: 24,
    categoria: 'procesos',
    label: 'Planifica y ejecuta reuniones en los últimos 12 meses para difundir, coordinar y retroalimentar respecto de documentos técnicos e indicadores críticos del programa.',
  },
  {
    itemNumero: 25,
    categoria: 'procesos',
    label: 'El establecimiento realiza auditorías clínicas y retroalimentación al equipo ERA.',
  },
  {
    itemNumero: 26,
    categoria: 'procesos',
    label: 'El establecimiento dispone de un plan de acción destinado a reducir las hospitalizaciones por condiciones sensibles al cuidado ambulatorio en salud respiratoria.',
  },
  {
    itemNumero: 27,
    categoria: 'procesos',
    label: 'Los profesionales de la sala ERA realizan consejería antitabáquica.',
  },
  {
    itemNumero: 28,
    categoria: 'procesos',
    label: 'El establecimiento dispone de intervenciones individuales para la prescripción de actividad física.',
  },
  {
    itemNumero: 29,
    categoria: 'procesos',
    label: 'El establecimiento dispone de información de la cobertura de vacunación en población bajo control ERA.',
  },
  {
    itemNumero: 30,
    categoria: 'procesos',
    label: 'El establecimiento realiza investigación de CPT en PBC de sala ERA, al ingreso y luego cada 6 meses.',
  },
  {
    itemNumero: 31,
    categoria: 'procesos',
    label: 'El establecimiento caracteriza y gestiona sus usuarios poli consultantes en SAPU/SAR/SUR o UEH.',
  },
  {
    itemNumero: 32,
    categoria: 'procesos',
    label: 'El establecimiento realiza visita domiciliaria de seguimiento a personas de los programas de oxigenoterapia ambulatoria, AVNI, AVI, AVNIA, AVIA.',
  },
  {
    itemNumero: 33,
    categoria: 'procesos',
    label: 'El total de auditorías ejecutadas por defunción por neumonía ocurrida en domicilio se registra en plataforma ADENED.',
  },
];

export const ITEM_LABELS: Record<number, string> = Object.fromEntries(
  EVALUATION_ITEMS.map((item) => [item.itemNumero, item.label])
);

export const ESTRUCTURA_COUNT = 12;
export const PROCESOS_COUNT = 21;
export const TOTAL_ITEMS = ESTRUCTURA_COUNT + PROCESOS_COUNT;
