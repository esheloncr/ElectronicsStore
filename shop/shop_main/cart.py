from rest_framework.response import Response
from .models import Cart, CartID


class CartMain:
    def __init__(self, request):
        self.session = request.session
        self.session_key = self.session.session_key
        self.cart_id = self._select_cart()
        #self._set_expiry()

    def _select_cart(self):
        cart = CartID.objects.get_or_create(
            session_key=self.session_key,
            defaults={'session_key': self.session_key}
        )
        return cart[0]

    def add(self, product_obj, cart_id):
        if not self.check_availability(product_obj):
            return Response({"error": "out of stock"})
        key = CartID.objects.get(session_key=cart_id)
        cost_per_item = product_obj.price
        total_count = 1 if not len(Cart.objects.filter(cart_id=key, product_id=product_obj)) else \
            Cart.objects.get(cart_id=key, product_id=product_obj).total_count + 1
        total_price = cost_per_item * total_count
        obj, updated = Cart.objects.update_or_create(
            cart_id=key, product_id=product_obj,
            defaults={'total_count': total_count, 'total_cost': total_price, 'cost_per_item': cost_per_item}
        )
        return Response({"message": "success"})

    def remove_from_cart(self, product_obj, cart_id):
        key = CartID.objects.get(session_key=cart_id)
        try:
            queryset = Cart.objects.filter(product_id=product_obj, cart_id=key)
            if not len(queryset):
                return Response({"error": "No product in cart"})
            queryset.delete()
            return Response({"message": "success"})
        except Exception as e:
            print(e)
            return Response({"error": "No product in cart"})

    def remove_one(self, product_obj, cart_id):
        key = CartID.objects.get(session_key=cart_id)
        try:
            queryset = Cart.objects.filter(product_id=product_obj, cart_id=key)
            count = queryset[0].total_count - 1
            if count <= 0:
                self.remove_from_cart(product_obj)
            queryset.update(total_count=count)
            return Response({"message": "success"})
        except Exception as e:
            print(e)
            return Response({"error": "No product in cart"})

    def check_availability(self, product_obj):
        if product_obj.balance < 1:
            return False
        try:
            cart_obj = Cart.objects.filter(product_id=product_obj)
            total_count = 0
            for c in cart_obj:
                total_count += c.total_count
            if total_count >= product_obj.balance:
                return False
        except Exception as e:
            print(e)
        return True

    def _set_expiry(self):
        self.session.set_expiry(10)
