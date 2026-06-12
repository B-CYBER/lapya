from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class AppException(Exception):
    def __init__(self, code: str, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppException)
    async def _app_exception_handler(_: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.code, "message": exc.message},
        )

    @app.exception_handler(RequestValidationError)
    async def _validation_exception_handler(_: Request, exc: RequestValidationError):
        first = exc.errors()[0] if exc.errors() else {"msg": "Invalid request."}
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"error": "validation_error", "message": first.get("msg", "Invalid request.")},
        )
