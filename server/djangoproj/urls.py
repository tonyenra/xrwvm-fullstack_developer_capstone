# djangoproj/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

react_view = TemplateView.as_view(template_name="index.html")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("djangoapp/", include("djangoapp.urls")),

    # Rutas React conocidas
    path("login/", react_view, name="react-login"),
    path("register/", react_view, name="react-register"),
    path('dealers/', TemplateView.as_view(template_name="index.html"), name='dealers'),
    path('dealer/<int:dealer_id>/', TemplateView.as_view(template_name="index.html"), name='dealer'),
    path('dealer/<int:dealer_id>', TemplateView.as_view(template_name="index.html")),
    path('postreview/<int:dealer_id>', TemplateView.as_view(template_name="index.html")),
    path("", react_view, name="react-home"),
]

# Catch-all para todo lo demás que no sea admin/djangoapp/static/media
urlpatterns += [re_path(r"^(?!admin/|djangoapp/|static/|media/).*$", react_view)]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
