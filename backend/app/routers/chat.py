from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.chat import ChatRequest
from app.services.chat import stream_chat

router = APIRouter()


@router.post("")
def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StreamingResponse:
    return StreamingResponse(
        stream_chat(current_user, db, payload.messages),
        media_type="text/event-stream",
    )
