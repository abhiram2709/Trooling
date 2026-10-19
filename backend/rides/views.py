from rest_framework import viewsets, permissions
from .models import Ride
from .serializers import RideSerializer

class RideViewSet(viewsets.ModelViewSet):
    queryset = Ride.objects.all()
    serializer_class = RideSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # <-- add this
