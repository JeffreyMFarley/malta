from django.apps import apps
from rest_framework import serializers
from .models import CV

Document = apps.get_model('documents', 'Document')

class DocumentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'url']
        extra_kwargs = {
            'url': {'view_name': 'document-detail'},
        }

class CVSerializer(serializers.HyperlinkedModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)

    class Meta:
        model = CV
        fields = '__all__'
        extra_kwargs = {
            'url': {'view_name': 'cv-detail'},
        }
