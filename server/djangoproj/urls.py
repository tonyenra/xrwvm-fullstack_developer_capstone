"""djangoproj URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Páginas estáticas
    path('about/',   TemplateView.as_view(template_name="About.html"),   name='about'),
    path('contact/', TemplateView.as_view(template_name="Contact.html"), name='contact'),
    path('',         TemplateView.as_view(template_name="Home.html"),    name='home'),

    # Página React para login
    path('login/', TemplateView.as_view(template_name="index.html"), name='react-login'),
    path('register/', TemplateView.as_view(template_name="index.html"), name='react-register'),

    # Rutas del app (incluye el endpoint JSON de login)
    path('djangoapp/', include('djangoapp.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
