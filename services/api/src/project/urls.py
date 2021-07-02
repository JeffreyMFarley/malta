from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from cv.views import CVViewSet
from documents.views import DocumentViewSet

router = DefaultRouter()
router.register('cv', CVViewSet)
router.register('documents', DocumentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('tags/', include('tags.urls')),
    path('', include(router.urls)),
]
