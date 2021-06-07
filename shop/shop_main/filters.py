from django_filters import FilterSet, CharFilter, NumberFilter
from .models import Product


class ProductFilter(FilterSet):
    title = CharFilter(field_name="title", lookup_expr="icontains")
    min_price = NumberFilter(field_name="price", lookup_expr="gte")
    max_price = NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Product
        fields = ['title']
        ordering = ["-price"]
