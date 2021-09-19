from django.test import TestCase
from ..models import Product, Category


class ProductTest(TestCase):
    def setUp(self) -> None:
        Category.objects.create(title="New")
        Product.objects.create(
            category_id=Category.objects.first(), company_id=None, title="Продукт", description="some descr", price=500, balance=10
        )

    def test(self):
        a = Product.objects.get(id=1)
        self.assertTrue(a.company_id)