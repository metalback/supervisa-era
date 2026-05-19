from fastapi import FastAPI

from api.app.routes import router

app = FastAPI(title="Supervisión Sala ERA API")
app.include_router(router)
