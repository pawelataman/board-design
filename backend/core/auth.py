from clerk_backend_api import Clerk, User
from clerk_backend_api.security import RequestState
from clerk_backend_api.security.types import AuthenticateRequestOptions
from fastapi import HTTPException, Request, status
from loguru import logger

from core.settings import get_settings

settings = get_settings()

sdk = Clerk(settings.clerk_secret_key)


async def require_auth(request: Request) -> str:
    """Verify Clerk session token and return the user_id."""
    state: RequestState = sdk.authenticate_request(
        request,
        AuthenticateRequestOptions(),
    )
    if not state.is_signed_in:
        logger.warning(f"Auth failed: {state.reason} — {state.message}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=state.message or "Unauthenticated",
        )

    user_id: str = state.payload["sub"]  # ty:ignore[not-subscriptable]
    logger.info(f"Authenticated user_id: {user_id}")
    return user_id


async def get_user_info(user_id: str) -> User:
    """Fetch user info from Clerk."""
    try:
        user: User = await sdk.users.get_async(user_id=user_id)
        return user
    except Exception as e:
        logger.error(f"Failed to fetch user info for user_id: {user_id} — {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user info",
        )
