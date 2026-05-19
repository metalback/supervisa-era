import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import type { Evaluation, TasaResultado, EvaluacionItem } from '../db';

export function createMockEvaluation(overrides?: Partial<Evaluation>): Evaluation {
  return {
    id: 'test-uuid-1',
    establecimiento: 'CESFAM Test',
    status: 'draft',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    fecha: null,
    region: null,
    comuna: null,
    codigo_deis: null,
    director: null,
    encargado_era: null,
    poblacion_rem_p3: null,
    horas_administrativas: null,
    email_contacto: null,
    compromisos: null,
    ...overrides,
  };
}

export function createMockItems(evaluationId = 'test-uuid-1', count = 33): EvaluacionItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    evaluation_id: evaluationId,
    item_numero: i + 1,
    categoria: i < 12 ? 'estructura' : 'procesos',
    puntaje: null,
    observacion: null,
  }));
}

export function createMockTasas(evaluationId = 'test-uuid-1'): TasaResultado[] {
  return [
    { id: 1, evaluation_id: evaluationId, tipo: 'asma', numerador: null, denominador: null },
    { id: 2, evaluation_id: evaluationId, tipo: 'epoc', numerador: null, denominador: null },
    { id: 3, evaluation_id: evaluationId, tipo: 'cobertura_vnc', numerador: null, denominador: null },
  ];
}

export function renderWithProviders(
  component: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(component, options);
}
