from collections import deque
from threading import Lock
from time import monotonic

from fastapi import (
    HTTPException,
    Request,
    status,
)


_attempts: dict[
    str,
    deque[float],
] = {}

_lock = Lock()

_check_count = 0


def get_client_address(
    request: Request,
) -> str:
    if request.client is None:
        return "unknown"

    return request.client.host


def cleanup_expired_attempts(
    now: float,
    maximum_window: int,
) -> None:
    expired_keys = []

    for key, timestamps in _attempts.items():
        while (
            timestamps
            and now - timestamps[0]
            >= maximum_window
        ):
            timestamps.popleft()

        if not timestamps:
            expired_keys.append(key)

    for key in expired_keys:
        _attempts.pop(
            key,
            None,
        )


def enforce_rate_limit(
    request: Request,
    *,
    scope: str,
    limit: int,
    window_seconds: int,
) -> None:
    global _check_count

    now = monotonic()

    client_address = (
        get_client_address(
            request
        )
    )

    key = (
        f"{scope}:"
        f"{client_address}"
    )

    with _lock:
        _check_count += 1

        if _check_count >= 500:
            cleanup_expired_attempts(
                now=now,
                maximum_window=max(
                    window_seconds,
                    3600,
                ),
            )

            _check_count = 0

        timestamps = (
            _attempts.setdefault(
                key,
                deque(),
            )
        )

        while (
            timestamps
            and now - timestamps[0]
            >= window_seconds
        ):
            timestamps.popleft()

        if len(timestamps) >= limit:
            retry_after = max(
                1,
                int(
                    window_seconds
                    - (
                        now
                        - timestamps[0]
                    )
                ),
            )

            raise HTTPException(
                status_code=(
                    status.HTTP_429_TOO_MANY_REQUESTS
                ),
                detail=(
                    "Too many requests. "
                    "Please try again later."
                ),
                headers={
                    "Retry-After":
                        str(retry_after),
                },
            )

        timestamps.append(now)
