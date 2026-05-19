from pydantic import BaseModel


class Tasa(BaseModel):
    numerador: int
    denominador: int


class TasasResultado(BaseModel):
    asma: Tasa
    epoc: Tasa
    cobertura_vnc: Tasa


class Metadata(BaseModel):
    fecha: str
    establecimiento: str
    codigo_deis: str
    comuna: str
    region: str
    director: str
    encargado_era: str
    poblacion_rem_p3: int
    horas_administrativas: int
    email_contacto: str


class EvaluacionItem(BaseModel):
    item: int
    puntaje: int
    observacion: str = ""


class Evaluacion(BaseModel):
    estructura: list[EvaluacionItem]
    procesos: list[EvaluacionItem]


class Cierre(BaseModel):
    compromisos: str


class EvaluacionRequest(BaseModel):
    metadata: Metadata
    tasas_resultado: TasasResultado
    evaluacion: Evaluacion
    cierre: Cierre
