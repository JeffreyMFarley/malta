from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'raw', 'url']
        extra_kwargs = {
            'url': {'view_name': 'document-detail'},
        }
