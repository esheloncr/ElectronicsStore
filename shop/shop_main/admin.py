from django.contrib import admin
from .models import Category, Company, Product
from .forms import ProductCreationForm
# Register your models here.


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title']


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = [
        'title'
    ]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'category_id',
        'company_id',
        'title',
        'description',
        'price',
        'balance'
    ]
    list_filter = [
        'price',
        'balance'
    ]
    form = ProductCreationForm
