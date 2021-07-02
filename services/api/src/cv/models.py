from django.db import models

# Create your models here.
class CV(models.Model):
    agency = models.CharField(max_length=200)
    office = models.CharField(max_length=200, blank=True)
    project_name = models.CharField(max_length=200)
    prime = models.CharField(max_length=200, blank=True)
    subs = models.CharField(max_length=200, blank=True)
    staff_size = models.IntegerField(blank=True, null=True)
    pop_start = models.DateField(blank=True, null=True)
    pop_end = models.DateField(blank=True, null=True)
    documents = models.ManyToManyField(
        'documents.Document', through='CVDocument', related_name='cvs'
    )

    class Meta:
        db_table = 'cv'
        verbose_name = 'CV'
        verbose_name_plural = 'CVs'

    def __str__(self):
        return '{} - {}'.format(self.agency, self.project_name)


class CVDocument(models.Model):
    cv = models.ForeignKey(
        CV,
        related_name='membership',
        on_delete=models.SET_NULL,
        null=True
    )
    document = models.ForeignKey(
        'documents.Document',
        related_name='membership',
        on_delete=models.SET_NULL,
        null=True
    )

    def __str__(self):
        return "{} belongs to {}".format(self.document, self.cv)
