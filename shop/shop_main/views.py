from .models import Category, Company, Product
from .serializers import CategorySerializer, Company, ProductSerializer
from .filters import ProductFilter
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from django_filters.rest_framework import DjangoFilterBackend, OrderingFilter
# Create your views here.


def index(request):
    return render(request, "index.html")


class ProductApiView(ListModelMixin, GenericViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter
    ordering_class = OrderingFilter
    ordering_fields = [
        "title",
        "price",
        "balance"
    ]

    def get_queryset(self):
        if self.request.GET.get("order_by") == str(1):
            print(123)
            return Product.objects.order_by("-price")
    #permission_classes = [IsAuthenticated]

