from django_filters import FilterSet, NumberFilter, ModelChoiceFilter
from .models import Product, Category


class ProductFilter(FilterSet):
    min_price = NumberFilter(field_name="price", lookup_expr="gte")
    max_price = NumberFilter(field_name="price", lookup_expr="lte")
    category = ModelChoiceFilter(queryset=Category.objects.all(), field_name="category_id_id")

    class Meta:
        model = Product
        fields = ['title']
        ordering = ["-price"]
