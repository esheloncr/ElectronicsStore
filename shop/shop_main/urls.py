from django.urls import path, include
from .views import index
from shop_main.api.v1.urls import api_urlpatterns

urlpatterns = [
    path('', index),
    path('api/v1/', include(api_urlpatterns)),
]
