from rest_framework import viewsets
from .models import Document
from .serializers import DocumentSerializer

# -----------------------------------------------------------------------------
# Request Handlers

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
