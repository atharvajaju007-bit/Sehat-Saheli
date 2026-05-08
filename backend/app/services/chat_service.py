"""
Chat service — business logic for chat sessions and message handling.
Orchestrates between repositories and the AI service.
"""

from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, ForbiddenException
from app.core.logging import get_logger
from app.models.chat import ChatMessage, ChatSession
from app.repositories.chat_repo import ChatMessageRepository, ChatSessionRepository
from app.schemas.chat import (
    ChatMessageRequest,
    ChatMessageResponse,
    ChatSendResponse,
    ChatSessionCreateRequest,
    ChatSessionResponse,
)
from app.services.ai_service import get_ai_service

logger = get_logger(__name__)

MEDICAL_DISCLAIMER = "💡 This is educational information only. Please consult a healthcare provider for personalized medical advice."


class ChatService:
    """Manages chat sessions and message flow with AI integration."""

    def __init__(self, session: AsyncSession) -> None:
        self._session_repo = ChatSessionRepository(session)
        self._message_repo = ChatMessageRepository(session)
        self._ai_service = get_ai_service()

    async def create_session(
        self,
        user_id: str,
        data: ChatSessionCreateRequest,
    ) -> ChatSessionResponse:
        """Create a new chat session for the user."""
        chat_session = ChatSession(
            user_id=user_id,
            title=data.title,
            language=data.language,
        )
        chat_session = await self._session_repo.create(chat_session)
        logger.info("chat_session_created", session_id=chat_session.id, user_id=user_id)

        return ChatSessionResponse(
            id=chat_session.id,
            title=chat_session.title,
            language=chat_session.language,
            created_at=chat_session.created_at,
            updated_at=chat_session.updated_at,
            message_count=0,
        )

    async def get_user_sessions(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 20,
    ) -> list[ChatSessionResponse]:
        """List all chat sessions for a user with message counts."""
        sessions = await self._session_repo.get_user_sessions(user_id, skip=skip, limit=limit)
        result = []
        for s in sessions:
            count = await self._message_repo.count_session_messages(s.id)
            result.append(ChatSessionResponse(
                id=s.id,
                title=s.title,
                language=s.language,
                created_at=s.created_at,
                updated_at=s.updated_at,
                message_count=count,
            ))
        return result

    async def send_message(
        self,
        session_id: str,
        user_id: str,
        data: ChatMessageRequest,
    ) -> ChatSendResponse:
        """
        Process a user message:
        1. Validate session ownership
        2. Save user message
        3. Get conversation context
        4. Generate AI response
        5. Save AI message
        6. Return both messages
        """
        # Verify session belongs to user
        chat_session = await self._session_repo.get_user_session(session_id, user_id)
        if not chat_session:
            raise NotFoundException("Chat session", session_id)

        # Save user message
        user_msg = ChatMessage(
            session_id=session_id,
            role="user",
            content=data.content,
            language=data.language,
        )
        user_msg = await self._message_repo.create(user_msg)

        # Build conversation context for AI
        recent_messages = await self._message_repo.get_recent_context(session_id, limit=10)
        history = [{"role": m.role, "content": m.content} for m in recent_messages]

        # Generate AI response
        ai_response_text = await self._ai_service.generate_response(
            user_message=data.content,
            conversation_history=history,
            language=data.language,
        )

        # Save AI message
        ai_msg = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=ai_response_text,
            language=data.language,
        )
        ai_msg = await self._message_repo.create(ai_msg)

        # Generate a descriptive title using AI for the first message
        if chat_session.title == "New Chat":
            title = await self._ai_service.generate_title(
                user_message=data.content,
                ai_response=ai_response_text,
            )
            await self._session_repo.update(chat_session, {"title": title})

        logger.info(
            "chat_message_processed",
            session_id=session_id,
            user_id=user_id,
            language=data.language,
        )

        return ChatSendResponse(
            user_message=ChatMessageResponse.model_validate(user_msg),
            assistant_message=ChatMessageResponse.model_validate(ai_msg),
            disclaimer=MEDICAL_DISCLAIMER,
        )

    async def get_session_messages(
        self,
        session_id: str,
        user_id: str,
        skip: int = 0,
        limit: int = 50,
    ) -> list[ChatMessageResponse]:
        """Get paginated messages for a chat session."""
        chat_session = await self._session_repo.get_user_session(session_id, user_id)
        if not chat_session:
            raise NotFoundException("Chat session", session_id)

        messages = await self._message_repo.get_session_messages(
            session_id, skip=skip, limit=limit
        )
        return [ChatMessageResponse.model_validate(m) for m in messages]

    async def delete_session(self, session_id: str, user_id: str) -> None:
        """Delete a chat session and all its messages."""
        chat_session = await self._session_repo.get_user_session(session_id, user_id)
        if not chat_session:
            raise NotFoundException("Chat session", session_id)

        await self._session_repo.delete(chat_session)
        logger.info("chat_session_deleted", session_id=session_id, user_id=user_id)
