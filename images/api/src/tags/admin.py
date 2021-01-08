from django.contrib import admin
from .models import Dimension, Group, Tag

class DimensionAdmin(admin.ModelAdmin):
    list_display = ['name']
    ordering = ['id']


class GroupAdmin(admin.ModelAdmin):
    list_display = ['dimension', 'name']
    list_display_links = ['name']
    list_filter = ['dimension']
    ordering = ['id']


class TagAdmin(admin.ModelAdmin):
    list_display = ['group', 'name']
    list_display_links = ['name']
    list_filter = ['group']
    ordering = ['id']

admin.site.register(Dimension, DimensionAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Tag, TagAdmin)
