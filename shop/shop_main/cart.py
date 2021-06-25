from rest_framework.response import Response
from .models import Cart


class CartMain:
    def __init__(self, request):
        self.session = request.session

    def add(self, product_obj):
        queryset, created = Cart.objects.get_or_create(
            product_id=product_obj,
            defaults={'product_id': product_obj, 'total_count': 0, 'total_cost': 0}
        )

        total_price = product_obj.price + queryset.total_cost
        total_count = queryset.total_count + 1

        obj, updated = Cart.objects.update_or_create(
            product_id=product_obj,
            defaults={'total_count': total_count, 'total_cost': total_price}
        )
        return Response({"message": "success"})

    def remove_from_cart(self, product_obj):
        try:
            queryset = Cart.objects.get(product_id=product_obj)
            queryset.delete()
            return Response({"message": "success"})
        except Exception as e:
            print(e)
            return Response({"error": "No product in cart"})

    def remove_one(self, product_obj):
        try:
            queryset = Cart.objects.filter(product_id=product_obj)
            count = queryset[0].total_count - 1
            if count <= 0:
                self.remove_from_cart(product_obj)
            queryset.update(total_count=count)
            return Response({"message": "success"})
        except Exception as e:
            print(e)
            return Response({"error": "No product in cart"})

    def check_availability(self):
        pass
