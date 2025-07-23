from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = 'djangoapp'

urlpatterns = [
    path('login', views.login_user, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('register', views.register_user, name='register'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
