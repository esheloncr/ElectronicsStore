from django.shortcuts import render


def index(request):
    key = request.session.session_key
    if not key:
        request.session.create()
    return render(request, "index.html")
