from django.contrib import admin

from .models import Dimension, Group, Tag

admin.site.register(Dimension)
admin.site.register(Group)
admin.site.register(Tag)
