from django.db import models

# Create your models here.
class Dimension(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Group(models.Model):
    dimension = models.ForeignKey(Dimension, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)

    def __str__(self):
        return '/'.join([self.dimension.name, self.name])

class Tag(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)

    def __str__(self):
        return '/'.join([str(self.group), self.name])
