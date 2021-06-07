from django.urls import path
from .views import index

app_name = "shop_main"

urlpatterns = [
    path('', index)
]
