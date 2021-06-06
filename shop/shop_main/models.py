from django.db import models

# Create your models here.


class Category(models.Model):
    title = models.CharField(max_length=255, verbose_name="Название")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.title


class SubCategory(models.Model):
    category_id = models.ForeignKey("Category", on_delete=models.CASCADE, related_name="subcategories",
                                    verbose_name="Основная категория")
    title = models.CharField(max_length=255, verbose_name="Название")

    class Meta:
        verbose_name = "Подкатегория"
        verbose_name_plural = "Подкатегории"

    def __str__(self):
        return self.title


class Product(models.Model):
    category_id = models.ForeignKey("Category", on_delete=models.CASCADE, related_name="categories")
    sub_category_id = models.ForeignKey("SubCategory", on_delete=models.CASCADE, related_name="subcategories",
                                        verbose_name="Подкатегория", null=True)  # убрать _ между первым и вторым словом
    title = models.CharField(max_length=255, verbose_name="Название")
    description = models.TextField(verbose_name="Описание")
    price = models.PositiveIntegerField(verbose_name="Стоимость")
    balance = models.PositiveIntegerField(verbose_name="Остаток")

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self):
        return self.title
