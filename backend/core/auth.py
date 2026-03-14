from clerk_backend_api import Clerk
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from loguru import logger

sdk = Clerk()
oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def basic_auth(token: str = Depends(oauth_scheme)):
    logger.info("Authenticating request")
    logger.info(f"Token received: {token}")
    if token is None:
        logger.warning("Missing or invalid Authorization header")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )
    try:
        session = await sdk.verify_token(token)
        logger.info(f"Authenticated user: {session.user_id}")
    except Exception as e:
        logger.warning(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
