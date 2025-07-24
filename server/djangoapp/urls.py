from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = 'djangoapp'

urlpatterns = [
    path('login', views.login_request, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('register', views.register_user, name='register'),
    path('get_cars/', views.get_cars, name='getcars'),
    path(route='get_dealers/', view=views.get_dealerships, name='get_dealers'),
    path(route='get_dealers/<str:state>/', view=views.get_dealerships, name='get_dealers_by_state'),
    path(route='dealer/<int:dealer_id>/', view=views.get_dealer_details, name='dealer_details'),
    path("get_dealerships", views.get_dealerships, name="get_dealerships"),
    path(route='reviews/dealer/<int:dealer_id>/', view=views.get_dealer_reviews, name='dealer_details'),
    path(route='add_review', view=views.add_review, name='add_review'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)