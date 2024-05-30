from django.urls import path
from . import views
from checkout import webhook

urlpatterns = [
    path('', views.checkout, name='checkout'),
    path('checkout_success/<order_number>', views.checkout_success, name='checkout_success'),
    path('wh/', webhook.stripe_webhook, name='stripe_webhook'),
]

