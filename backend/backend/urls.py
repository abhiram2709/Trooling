from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rides.views import RideViewSet
from rest_framework.authtoken.views import obtain_auth_token  # <-- add this

# Router for DRF
router = DefaultRouter()
router.register(r'rides', RideViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # your API routes

    # Token authentication endpoint
    path('api/token-auth/', obtain_auth_token, name='api_token_auth'),  # <-- add this
]
