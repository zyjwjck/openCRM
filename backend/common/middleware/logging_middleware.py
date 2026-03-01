import logging
from django.utils.deprecation import MiddlewareMixin
from crum import get_current_user


class UserFilter(logging.Filter):
    """
    Log filter that adds current user information to log records
    """
    def filter(self, record):
        user = get_current_user()
        if user and hasattr(user, 'id'):
            if hasattr(user, 'username'):
                record.user = f"{user.username} (ID: {user.id})"
            else:
                record.user = f"User ID: {user.id}"
        else:
            record.user = "Anonymous"
        return True


class LoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log requests with user information
    """
    def process_request(self, request):
        # This middleware doesn't modify the request, just ensures user is available for logging
        return None
