from django.urls import path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls

from shop.schema import CoreAPISchemaGenerator
from .views import ProductApiView, ProductSearch, CompanyList, CategoryList, CartAPIView


router = routers.SimpleRouter()
router.register(r"products", ProductApiView)
router.register(r"search", ProductSearch)
router.register(r"companies", CompanyList)
router.register(r"categories", CategoryList)
router.register(r"cart", CartAPIView)

api_urlpatterns = [
    path('doc/', include_docs_urls(title='API', authentication_classes=[], permission_classes=[],
                                   generator_class=CoreAPISchemaGenerator)),
    #path(r'products/<int:pk>/', CurrentProductApiView.as_view()),
] + router.urls
