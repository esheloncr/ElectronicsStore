from django.shortcuts import render
from .models import Test, Product
from django.forms import ModelChoiceField, Form, CharField, ModelForm
# Create your views here.


# view for template
def index(request):
    key = request.session.session_key
    if not key:
        request.session.create()
    return render(request, "index.html")


class CustomForm(Form):
    field = CharField()


def test(request):
    """if request.method == "POST":
        form = CustomForm(request.POST)
        if form.is_valid():
            status = form.cleaned_data['field']
            Test.create(status).save()
        else:
            form = CustomForm()"""
    #return render(request, "test.html", locals())
    query = Product.objects.all()
    return render(request, "test.html", context={"data": query})
