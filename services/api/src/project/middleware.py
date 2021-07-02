from django.conf import settings
from rest_framework.response import Response

def _buildHeaders():
    headers = {}
    # Local development requires CORS support
    if settings.DEBUG:
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET'
        }
    return headers


class NoCorsOnDebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.cors_headers = _buildHeaders()

    def __call__(self, request):
        response = self.get_response(request)

        # Apply CORS headers
        for k,v in self.cors_headers.items():
            response[k] = v

        return response
