from django.db import models
from django.contrib.auth.models import User

# Ride created by a driver
class Ride(models.Model):
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rides_given')
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()
    seats_available = models.IntegerField()
    price_per_seat = models.FloatField()

    def __str__(self):
        return f"{self.origin} → {self.destination} on {self.date}"

# Booking made by a passenger
class Booking(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE, related_name='bookings')
    passenger = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rides_taken')
    seats_booked = models.IntegerField()
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.passenger.username} booked {self.seats_booked} seat(s) for {self.ride}"

# Optional: Ratings for completed rides
class RideRating(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE, related_name='ratings')
    passenger = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()  # 1 to 5
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.passenger.username} rated {self.ride} as {self.rating}"
