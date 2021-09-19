from django.urls import path, include
from .views import index, test
import ElectronicsStore.shop.shop_main.api.v1.urls
from shop_main.api.v1.urls import api_urlpatterns

urlpatterns = [
    path('', index),
    path('api/v1/', include(api_urlpatterns)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('test/', test)
]