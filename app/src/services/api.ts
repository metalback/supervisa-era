import type { Evaluation, TasaResultado, EvaluacionItem } from '../db';

const DEFAULT_BASE_URL = 'http://localhost:8000';

let baseUrl = DEFAULT_BASE_URL;

export function setApiBaseUrl(url: string) {
  baseUrl = url;
}

export function getApiBaseUrl(): string {
  return baseUrl;
}

export interface EvaluacionPayload {
  metadata: {
    establecimiento: string;
    codigo_deis: string;
    region: string;
    comuna: string;
    fecha: string;
    director: string;
    encargado_era: string;
    poblacion_rem_p3: number | null;
    horas_administrativas: number | null;
    email_contacto: string;
  };
  tasas_resultado: {
    asma: { numerador: number | null; denominador: number | null };
    epoc: { numerador: number | null; denominador: number | null };
    cobertura_vnc: { numerador: number | null; denominador: number | null };
  };
  evaluacion: {
    estructura: { item_numero: number; puntaje: number | null; observacion: string | null }[];
    procesos: { item_numero: number; puntaje: number | null; observacion: string | null }[];
  };
  cierre: {
    compromisos: string;
    email_destinatario: string;
  };
}

export function buildPayload(
  evaluation: Evaluation,
  tasas: TasaResultado[],
  items: EvaluacionItem[]
): EvaluacionPayload {
  const getTasa = (tipo: string) =>
    tasas.find((t) => t.tipo === tipo) || { numerador: null, denominador: null };

  return {
    metadata: {
      establecimiento: evaluation.establecimiento || '',
      codigo_deis: evaluation.codigo_deis || '',
      region: evaluation.region || '',
      comuna: evaluation.comuna || '',
      fecha: evaluation.fecha || '',
      director: evaluation.director || '',
      encargado_era: evaluation.encargado_era || '',
      poblacion_rem_p3: evaluation.poblacion_rem_p3,
      horas_administrativas: evaluation.horas_administrativas,
      email_contacto: evaluation.email_contacto || '',
    },
    tasas_resultado: {
      asma: getTasa('asma'),
      epoc: getTasa('epoc'),
      cobertura_vnc: getTasa('cobertura_vnc'),
    },
    evaluacion: {
      estructura: items
        .filter((i) => i.categoria === 'estructura')
        .map((i) => ({
          item_numero: i.item_numero,
          puntaje: i.puntaje,
          observacion: i.observacion,
        })),
      procesos: items
        .filter((i) => i.categoria === 'procesos')
        .map((i) => ({
          item_numero: i.item_numero,
          puntaje: i.puntaje,
          observacion: i.observacion,
        })),
    },
    cierre: {
      compromisos: evaluation.compromisos || '',
      email_destinatario: evaluation.email_destinatario || '',
    },
  };
}

export async function generateExcel(payload: EvaluacionPayload): Promise<Blob> {
  const response = await fetch(`${baseUrl}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error('Error del servidor. Intente más tarde.');
    }
    if (response.status === 422) {
      throw new Error('Datos de evaluación inválidos. Revise los campos.');
    }
    throw new Error('No se pudo generar la planilla. Verifique su conexión.');
  }

  return response.blob();
}
