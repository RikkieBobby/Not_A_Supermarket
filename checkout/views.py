from django.shortcuts import render, redirect, reverse
from django.contrib import messages
from .forms import OrderForm
from .models import OrderItem
from bag.contexts import bag_contents
from products.models import Product

def checkout(request):
    bag = request.session.get('bag', {})
    if not bag:
        messages.error(request, "There's nothing in your bag at the moment")
        return redirect(reverse('products'))

    order_form = OrderForm()
    template = 'checkout/checkout.html'
    context = {
        'order_form': order_form,
        'stripe_public_key': 'pk_test_51PIylsIxx2RT5EhAFq3FCEv13sIqhZWUCHiSuw8CAtwtQUxBU6EDJNDWg7YOcOX1qnFkgCZTIP3Y1MsGy3kcWvBV000Aw86372',
        'client_secret': 'test client secret',
    }

    return render(request, template, context)
