from rest_framework.generics import ListAPIView
from shop_main.models import Category, Company, Product
from .serializers import CategorySerializer, CompanySerializer, ProductSerializer
from shop_main.filters import ProductFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from django_filters.rest_framework import DjangoFilterBackend


class ProductApiView(ListAPIView, GenericViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter


class ProductSearch(ListAPIView, GenericViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        return self.queryset.filter(title__icontains=self.request.GET.get("srch"))


class CategoryList(ListAPIView, GenericViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CompanyList(ListAPIView, GenericViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
