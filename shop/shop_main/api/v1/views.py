from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from shop_main.models import Category, Company, Product, Cart
from .serializers import CategorySerializer, CompanySerializer, ProductSerializer, CartSerializer
from shop_main.filters import ProductFilter
from shop_main.paginators import CustomPageNumber
from shop_main.cart import CartMain
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import GenericViewSet, ViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_list_or_404
from django.http import Http404


class ProductApiView(ListAPIView, GenericViewSet):
    queryset = Product.objects.all()
    permission_classes = [AllowAny, ]
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter
    pagination_class = None

    @action(detail=False, methods=['GET'], url_path='add/(?P<pk>[^/.]+)')
    def add(self, request, pk):
        cart = CartMain(request)
        self.queryset = Product.objects.get(pk=pk)
        add = cart.add(self.queryset)
        return add

    @action(detail=False, methods=['GET'], url_path='remove/(?P<pk>[^/.]+)')
    def remove_one(self, request, pk):
        cart = CartMain(request)
        self.queryset = Product.objects.get(pk=pk)
        remove = cart.remove_one(self.queryset)
        return remove

    @action(detail=False, methods=['GET'], url_path='rft/(?P<pk>[^/.]+)')
    def remove_from_cart(self, request, pk):
        cart = CartMain(request)
        self.queryset = Product.objects.get(pk=pk)
        remove = cart.remove_from_cart(self.queryset)
        return remove


class ProductSearch(ListAPIView, GenericViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny, ]
    pagination_class = None

    def get_queryset(self):
        return self.queryset.filter(title__icontains=self.request.GET.get("srch"))


class CategoryList(ListAPIView, GenericViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny, ]
    pagination_class = None


class CompanyList(ListAPIView, GenericViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, ]
    pagination_class = None


class CartAPIView(ListAPIView, GenericViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [AllowAny, ] # Change to auth
    pagination_class = None

    def list(self, request, *args, **kwargs):
        if not len(self.queryset):
            return Response({"message": "Cart is empty!"})
        queryset = self.queryset
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
