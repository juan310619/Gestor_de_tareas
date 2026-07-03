import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request as FastAPIRequest
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.database.database import create_tables
from app.models import user_model, tasks_model, projects_model
from app.routes import api

load_dotenv()

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(redirect_slashes=False)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: FastAPIRequest, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        msg = error.get("msg", "")
        msg = msg.replace("Value error, ", "")
        field = error.get("loc", [])[-1] if error.get("loc") else ""
        label = field.replace("_", " ").title() if field else ""
        errors.append(f"{label}: {msg}" if label else msg)
    return JSONResponse(
        status_code=422,
        content={"detail": ". ".join(errors)},
    )


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if response.status_code < 400:
            response.headers["X-Content-Type-Options"] = "nosniff"
            response.headers["X-Frame-Options"] = "DENY"
            response.headers["X-XSS-Protection"] = "1; mode=block"
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response


raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

print(f"INFO: Cargando orígenes permitidos: {allowed_origins}")

app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Crea las tablas al iniciar la aplicación
create_tables()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://gestor-de-tareas-iz9b.onrender.com")
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(__file__)), "Fronted", "dist")
FRONTEND_INDEX = os.path.join(FRONTEND_DIST, "index.html")

@app.get("/")
def read_root():
    if os.path.exists(FRONTEND_INDEX):
        with open(FRONTEND_INDEX, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return {"message": "Hola desde FastAPI 👋"}

app.include_router(api.api_router, prefix='/api')

@app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
async def catch_all_frontend_routes(full_path: str):
    if full_path.startswith("api/") or full_path.startswith("api"):
        return JSONResponse(status_code=404, content={"detail": "Not found"})

    if os.path.exists(FRONTEND_INDEX):
        with open(FRONTEND_INDEX, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())

    return RedirectResponse(url=FRONTEND_URL)