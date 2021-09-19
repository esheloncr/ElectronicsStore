from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.sessions.backends.db import SessionStore
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from shop_main.models import Category, Company, Product, Cart, CartID, Test
from .serializers import CategorySerializer, CompanySerializer, ProductSerializer, CartSerializer
from shop_main.filters import ProductFilter
from shop_main.paginators import CustomPageNumber
from shop_main.cart import CartMain
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import GenericViewSet, ViewSet, ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_list_or_404
from django.http import Http404
from django.shortcuts import render


class ProductApiView(ListAPIView, GenericViewSet):
    queryset = Product.objects.all()
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter
    pagination_class = None


class ProductSearch(ListAPIView, GenericViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return self.queryset.filter(title__icontains=self.request.GET.get("srch"))


class CategoryList(ListAPIView, GenericViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None


class CompanyList(ListAPIView, GenericViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]
    pagination_class = None


class CartAPIView(ListAPIView, GenericViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        key = self.get_key()
        self.queryset = Cart.objects.filter(cart_id=key)
        return self.queryset

    def list(self, request, *args, **kwargs):
        key = self.get_key()
        if not key:
            return Response({"message": "Cart is empty!"})
        sum = 0
        # сделать отдельный метод для подсчёта суммы
        queryset = Cart.objects.filter(cart_id=key)
        for q in queryset:
            sum += q.total_cost
        serializer = self.get_serializer(queryset, many=True)
        return Response((serializer.data, {"sum": sum}))

    def get_key(self):
        try:
            key = CartID.objects.get(session_key=self.request.session.session_key)
            return key
        except Exception as e:
            print(e)
            return False

    @action(detail=False, methods=['GET'], url_path='add/(?P<pk>[^/.]+)')
    def add(self, request, pk):
        cart = CartMain(request)
        self.queryset = Product.objects.get(pk=pk)
        add = cart.add(self.queryset, request.session.session_key)
        return add

    @action(detail=False, methods=['GET'], url_path='remove/(?P<pk>[^/.]+)')
    def remove_one(self, request, pk):
        cart = CartMain(request)
        self.queryset = Product.objects.get(pk=pk)
        remove = cart.remove_one(self.queryset, request.session.session_key)
        return remove

    @action(detail=False, methods=['GET'], url_path='rft/(?P<pk>[^/.]+)')
    def remove_from_cart(self, request, pk):
        cart = CartMain(request)
        self.queryset = Product.objects.get(pk=pk)
        remove = cart.remove_from_cart(self.queryset, request.session.session_key)
        return remove

