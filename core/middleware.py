import json
from django.http import JsonResponse

class StandardizedErrorMiddleware:
    """
    Middleware to catch global Django errors (like 401/403/404) and 
    ensure they return the same JSON schema as the API views.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Only intercept 401, 403, and 404 responses that aren't already JSON
        if response.status_code in [401, 403, 404] and 'application/json' not in response.get('Content-Type', ''):
            data = {
                "success": False,
                "message": self._get_status_message(response.status_code),
                "code": self._get_status_code_name(response.status_code),
                "errors": [],
                "status_code": response.status_code
            }
            return JsonResponse(data, status=response.status_code)

        return response

    def _get_status_message(self, status_code):
        messages = {
            401: "Authentication credentials were not provided or are invalid.",
            403: "You do not have permission to perform this action.",
            404: "The requested resource was not found."
        }
        return messages.get(status_code, "An unexpected error occurred.")

    def _get_status_code_name(self, status_code):
        codes = {
            401: "not_authenticated",
            403: "permission_denied",
            404: "not_found"
        }
        return codes.get(status_code, "error")
