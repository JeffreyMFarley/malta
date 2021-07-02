from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=200)
    raw = models.TextField()
    spacy = models.BinaryField(null=True, blank=True)

    def __str__(self):
        return self.title
