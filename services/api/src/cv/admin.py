from django.contrib import admin
from django.apps import apps
from .models import CV, CVDocument

Document = apps.get_model('documents', 'Document')


class MembershipInline(admin.TabularInline):
    model = CVDocument
    extra = 0

class CVAdmin(admin.ModelAdmin):
    date_hierarchy = 'pop_start'
    fields = (
        'agency', 'office', 'project_name', 'prime', 'subs',
        'pop_start', 'pop_end', 'staff_size'
    )
    inlines = [MembershipInline]
    list_display = (
        'agency', 'office', 'project_name', 'prime', 'subs',
        'pop_start', 'pop_end', 'staff_size'
    )
    list_display_links = ['project_name']
    list_filter = ('agency', 'office', 'prime', 'subs')
    ordering = ['agency', 'office', 'pop_start', 'project_name']


admin.site.register(CV, CVAdmin)
