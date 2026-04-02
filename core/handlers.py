from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Standardizes error responses across the entire API.
    """
    # Call DRF's default exception handler first to get the standard error response.
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            "success": False,
            "message": "An error occurred while processing your request.",
            "code": getattr(exc, 'default_code', 'error'),
            "errors": [],
            "status_code": response.status_code
        }

        # Extract detailed error information if available
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                custom_data["message"] = response.data['detail']
            
            # Map validation errors
            for field, messages in response.data.items():
                if field != 'detail' and field != 'status_code':
                    if isinstance(messages, list):
                        for msg in messages:
                            custom_data["errors"].append({"field": field, "message": msg})
                    else:
                        custom_data["errors"].append({"field": field, "message": str(messages)})
        
        response.data = custom_data

    return response
