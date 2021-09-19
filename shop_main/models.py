from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Category(models.Model):
    title = models.CharField(max_length=255, verbose_name="Название")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.title


class Company(models.Model):
    title = models.CharField(max_length=255, verbose_name="Название")

    class Meta:
        verbose_name = "Название компании"
        verbose_name_plural = "Названия компаний"

    def __str__(self):
        return self.title


class Product(models.Model):
    category_id = models.ForeignKey("Category", on_delete=models.CASCADE, related_name="categories", null=True)
    company_id = models.ForeignKey("Company", on_delete=models.CASCADE, related_name="companies",
                                   verbose_name="Подкатегория", null=True)
    title = models.CharField(max_length=255, verbose_name="Название")
    description = models.TextField(verbose_name="Описание")
    price = models.PositiveIntegerField(verbose_name="Стоимость")
    balance = models.PositiveIntegerField(verbose_name="Остаток")
    photo = models.ImageField(upload_to='shop_main/static/images/', null=True, blank=True, verbose_name='Изображение',
                              default='shop_main/static/images/default_image.png')

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        ordering = ["-id"]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return f'product/{self.pk}'


class CartID(models.Model):
    session_key = models.CharField(max_length=255, null=True, unique=True)


class Cart(models.Model):
    cart_id = models.ForeignKey('CartID', on_delete=models.CASCADE, related_name="cart_ids", unique=False, null=True)
    product_id = models.ForeignKey("Product", on_delete=models.CASCADE, related_name="carts", unique=False, null=True)
    cost_per_item = models.PositiveIntegerField(null=True)
    total_count = models.PositiveIntegerField()
    total_cost = models.PositiveIntegerField()


class Test(models.Model):

    STATUS_SUCCESSFUL = "SuccessTransaction"
    STATUS_UNSUCCESSFUL = "UnsuccessfulTransaction"

    STATUSES = (
        (STATUS_SUCCESSFUL, "Успешная транзакция"),
        (STATUS_UNSUCCESSFUL, "Неудачная транзакция")
    )
    test_field = models.CharField(max_length=25, verbose_name="Статус транзакции", choices=STATUSES, default=STATUS_UNSUCCESSFUL, null=False)

    @classmethod
    def create(cls, status):
        if status == "1":
            test = cls(test_field=cls.STATUS_SUCCESSFUL)
            return test
        test = cls(test_field=cls.STATUS_UNSUCCESSFUL)
        return test
