from .views import ProductApiView
from rest_framework import routers

app_name = "shop_main"

router = routers.SimpleRouter()
router.register(r"products", ProductApiView)

urlpatterns = [] + router.urls
