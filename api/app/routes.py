from fastapi import APIRouter
from fastapi.responses import Response

from api.app.models import EvaluacionRequest
from api.services.injector import inject

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/generate")
def generate(payload: EvaluacionRequest):
    buf = inject(payload)
    filename = f"PAUTA_ERA_{payload.metadata.establecimiento}_{payload.metadata.fecha}.xlsx"

    return Response(
        content=buf.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
