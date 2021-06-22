from django.shortcuts import render
# Create your views here.


# view for template
def index(request):
    return render(request, "index.html")
