from django.contrib import admin

from .models import CV

    # agency = models.CharField(max_length=200)
    # office = models.CharField(max_length=200, blank=True)
    # project_name = models.CharField(max_length=200)
    # prime = models.CharField(max_length=200, blank=True)
    # subs = models.CharField(max_length=200, blank=True)
    # staff_size = models.IntegerField(blank=True, null=True)
    # pop_start = models.DateField(blank=True, null=True)
    # pop_end = models.DateField(blank=True, null=True)


class CVAdmin(admin.ModelAdmin):
    date_hierarchy = 'pop_start'
    fields = (
        'agency', 'office', 'project_name', 'prime', 'subs',
        'pop_start', 'pop_end', 'staff_size'
    )
    list_display = (
        'agency', 'office', 'project_name', 'prime', 'subs',
        'pop_start', 'pop_end', 'staff_size'
    )
    list_display_links = ['project_name']
    list_filter = ('agency', 'office', 'prime', 'subs')
    ordering = ['agency', 'office', 'pop_start', 'project_name']


admin.site.register(CV, CVAdmin)
