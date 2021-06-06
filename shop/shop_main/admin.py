from django.contrib import admin
from .models import Category, SubCategory, Product
# Register your models here.


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title']


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = [
        'category_id',
        'title'
    ]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'category_id',
        'sub_category_id',
        'title',
        'description',
        'price',
        'balance'
    ]
