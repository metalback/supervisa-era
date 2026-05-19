import { buildPayload, setApiBaseUrl, getApiBaseUrl } from '../src/services/api';
import type { Evaluation, TasaResultado, EvaluacionItem } from '../src/db';

describe('api', () => {
  describe('setApiBaseUrl / getApiBaseUrl', () => {
    it('returns default url initially', () => {
      expect(getApiBaseUrl()).toBe('http://localhost:8000');
    });

    it('updates and returns the base url', () => {
      setApiBaseUrl('http://192.168.1.100:8000');
      expect(getApiBaseUrl()).toBe('http://192.168.1.100:8000');
      setApiBaseUrl('http://localhost:8000');
    });
  });

  describe('buildPayload', () => {
    const baseEvaluation: Evaluation = {
      id: 'eval-1',
      establecimiento: 'CESFAM Test',
      status: 'complete',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      fecha: '2026-01-15',
      region: 'RM',
      comuna: 'Santiago',
      codigo_deis: '112233',
      director: 'Juan Director',
      encargado_era: 'Maria ERA',
      poblacion_rem_p3: 500,
      horas_administrativas: 40,
      email_contacto: 'test@test.cl',
      compromisos: 'Compromiso de prueba',
      email_destinatario: 'dest@test.cl',
    };

    const baseTasas: TasaResultado[] = [
      { id: 1, evaluation_id: 'eval-1', tipo: 'asma', numerador: 10, denominador: 100 },
      { id: 2, evaluation_id: 'eval-1', tipo: 'epoc', numerador: 5, denominador: 50 },
      { id: 3, evaluation_id: 'eval-1', tipo: 'cobertura_vnc', numerador: 80, denominador: 100 },
    ];

    const baseItems: EvaluacionItem[] = Array.from({ length: 33 }, (_, i) => ({
      id: i + 1,
      evaluation_id: 'eval-1',
      item_numero: i + 1,
      categoria: i < 12 ? 'estructura' : 'procesos',
      puntaje: 1,
      observacion: i === 0 ? 'Obs 1' : null,
    }));

    it('builds payload with all fields populated', () => {
      const payload = buildPayload(baseEvaluation, baseTasas, baseItems);

      expect(payload.metadata.establecimiento).toBe('CESFAM Test');
      expect(payload.metadata.codigo_deis).toBe('112233');
      expect(payload.metadata.region).toBe('RM');
      expect(payload.metadata.comuna).toBe('Santiago');
      expect(payload.metadata.fecha).toBe('2026-01-15');
      expect(payload.metadata.director).toBe('Juan Director');
      expect(payload.metadata.encargado_era).toBe('Maria ERA');
      expect(payload.metadata.poblacion_rem_p3).toBe(500);
      expect(payload.metadata.horas_administrativas).toBe(40);
      expect(payload.metadata.email_contacto).toBe('test@test.cl');
    });

    it('builds tasas_resultado correctly', () => {
      const payload = buildPayload(baseEvaluation, baseTasas, baseItems);

      expect(payload.tasas_resultado.asma.numerador).toBe(10);
      expect(payload.tasas_resultado.asma.denominador).toBe(100);
      expect(payload.tasas_resultado.epoc.numerador).toBe(5);
      expect(payload.tasas_resultado.epoc.denominador).toBe(50);
      expect(payload.tasas_resultado.cobertura_vnc.numerador).toBe(80);
    });

    it('splits items into estructura and procesos', () => {
      const payload = buildPayload(baseEvaluation, baseTasas, baseItems);

      expect(payload.evaluacion.estructura).toHaveLength(12);
      expect(payload.evaluacion.procesos).toHaveLength(21);
      expect(payload.evaluacion.estructura[0].item_numero).toBe(1);
      expect(payload.evaluacion.procesos[0].item_numero).toBe(13);
    });

    it('includes cierre data', () => {
      const payload = buildPayload(baseEvaluation, baseTasas, baseItems);

      expect(payload.cierre.compromisos).toBe('Compromiso de prueba');
      expect(payload.cierre.email_destinatario).toBe('dest@test.cl');
    });

    it('handles null fields gracefully', () => {
      const minimalEval: Evaluation = {
        ...baseEvaluation,
        establecimiento: null,
        codigo_deis: null,
        region: null,
        comuna: null,
        fecha: null,
        director: null,
        encargado_era: null,
        poblacion_rem_p3: null,
        horas_administrativas: null,
        email_contacto: null,
        compromisos: null,
        email_destinatario: null,
      };

      const payload = buildPayload(minimalEval, [], []);

      expect(payload.metadata.establecimiento).toBe('');
      expect(payload.metadata.codigo_deis).toBe('');
      expect(payload.metadata.poblacion_rem_p3).toBeNull();
      expect(payload.cierre.compromisos).toBe('');
      expect(payload.cierre.email_destinatario).toBe('');
    });

    it('defaults missing tasas to null values', () => {
      const payload = buildPayload(baseEvaluation, [], []);

      expect(payload.tasas_resultado.asma.numerador).toBeNull();
      expect(payload.tasas_resultado.asma.denominador).toBeNull();
      expect(payload.tasas_resultado.epoc.numerador).toBeNull();
    });
  });
});
