from .views import ProductApiView, ProductSearch, CategoryList, CompanyList
from rest_framework import routers

app_name = "shop_main"

router = routers.SimpleRouter()
router.register(r"products", ProductApiView)
router.register(r"search", ProductSearch)
router.register(r"companies", CompanyList)
router.register(r"categories", CategoryList)

urlpatterns = [] + router.urls
