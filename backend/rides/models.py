from django.db import models
from django.contrib.auth.models import User

class Ride(models.Model):
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rides_offered")
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()
    seats_available = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.origin} → {self.destination} by {self.driver.username}"
