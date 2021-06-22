from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from shop_main.models import Category, Company, Product
from .serializers import CategorySerializer, CompanySerializer, ProductSerializer
from shop_main.filters import ProductFilter
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import GenericViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.http import Http404


class ProductApiView(ListAPIView, GenericViewSet):
    queryset = Product.objects.all()
    permission_classes = [AllowAny, ]
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter


class ProductSearch(ListAPIView, GenericViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny, ]

    def get_queryset(self):
        return self.queryset.filter(title__icontains=self.request.GET.get("srch"))


class CategoryList(ListAPIView, GenericViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny, ]


class CompanyList(ListAPIView, GenericViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, ]


class CurrentProductApiView(APIView):
    permission_classes = [AllowAny, ]
    queryset = None

    def get_object_or_404(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Exception as e:
            print(e)
            raise Http404

    def get(self, request, pk):
        self.queryset = self.get_object_or_404(pk)
        serializer = ProductSerializer(self.queryset)
        return Response(serializer.data)
