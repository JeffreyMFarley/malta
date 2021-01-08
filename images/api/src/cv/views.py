from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

# -----------------------------------------------------------------------------
# Header methods

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

# -----------------------------------------------------------------------------
# Request Handlers: Complaints
@api_view(['GET'])
def index(request):
    data = []
    return Response(data, headers=_buildHeaders())
