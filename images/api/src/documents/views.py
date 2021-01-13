from rest_framework.decorators import api_view
from rest_framework.response import Response

# -----------------------------------------------------------------------------
# Request Handlers

@api_view(['GET'])
def index(request):
    data = []
    return Response(data)
