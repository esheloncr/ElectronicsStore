from django.forms import ModelForm
from .models import Product


class ProductCreationForm(ModelForm):
    class Media:
        js = (
            'js/admin.js',
        )

    class Meta:
        model = Product
        fields = '__all__'
