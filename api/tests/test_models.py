import pytest
from pydantic import ValidationError

from api.app.models import EvaluacionRequest


def test_valid_payload(sample_payload):
    model = EvaluacionRequest(**sample_payload)
    assert model.metadata.establecimiento == "CESFAM Los Alerces"
    assert model.tasas_resultado.asma.numerador == 25
    assert len(model.evaluacion.estructura) == 12
    assert len(model.evaluacion.procesos) == 21
    assert model.cierre.compromisos == "Implementar protocolo de rescate de inasistentes"


def test_missing_metadata_raises(sample_payload):
    del sample_payload["metadata"]
    with pytest.raises(ValidationError):
        EvaluacionRequest(**sample_payload)


def test_missing_evaluacion_raises(sample_payload):
    del sample_payload["evaluacion"]
    with pytest.raises(ValidationError):
        EvaluacionRequest(**sample_payload)


def test_missing_tasas_raises(sample_payload):
    del sample_payload["tasas_resultado"]
    with pytest.raises(ValidationError):
        EvaluacionRequest(**sample_payload)


def test_missing_cierre_raises(sample_payload):
    del sample_payload["cierre"]
    with pytest.raises(ValidationError):
        EvaluacionRequest(**sample_payload)
