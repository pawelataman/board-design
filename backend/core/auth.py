from this import s

from clerk_backend_api import Clerk, User
from clerk_backend_api.security import RequestState
from clerk_backend_api.security.types import AuthenticateRequestOptions
from fastapi import HTTPException, Request, status
from loguru import logger

from core.settings import get_settings

settings = get_settings()

clerk_sdk: Clerk | None = None


def get_clerk_sdk() -> Clerk:
    global clerk_sdk
    if clerk_sdk is None:
        if not settings.clerk_secret_key or settings.clerk_secret_key == "":
            logger.error("Clerk secret key is not set in environment variables")
            raise RuntimeError("Clerk secret key is required for authentication")
        clerk_sdk = Clerk(settings.clerk_secret_key)
    return clerk_sdk


async def require_auth(request: Request) -> str:
    """Verify Clerk session token and return the user_id."""

    sdk = get_clerk_sdk()
    state: RequestState = sdk.authenticate_request(
        request,
        AuthenticateRequestOptions(
            authorized_parties=[
                "http://localhost:5173"
            ],  # Adjust this to your frontend URL
        ),
    )
    if not state.is_signed_in:
        logger.warning(f"Auth failed: {state.reason} — {state.message}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
        )

    user_id: str = state.payload["sub"]  # ty:ignore[not-subscriptable]
    logger.info(f"Authenticated user_id: {user_id}")
    return user_id


async def get_user_info(user_id: str) -> User:
    """Fetch user info from Clerk."""
    sdk = get_clerk_sdk()
    try:
        user: User = await sdk.users.get_async(user_id=user_id)
        return user
    except Exception as e:
        logger.error(f"Failed to fetch user info for user_id: {user_id} — {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user info",
        )
