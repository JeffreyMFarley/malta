from rest_framework import viewsets
from .models import CV
from .serializers import CVSerializer

# -----------------------------------------------------------------------------
# Request Handlers

class CVViewSet(viewsets.ModelViewSet):
    """
    The CV of Pluribus.

    It contains the past performances with our clients
    """
    basename = "cv"
    queryset = CV.objects.all()
    serializer_class = CVSerializer
