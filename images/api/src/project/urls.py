from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('cv/', include('cv.urls')),
    path('documents/', include('documents.urls')),
    path('tags/', include('tags.urls')),
]
