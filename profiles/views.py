from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import UserProfile
from .forms import ProfileForm

@login_required
def profile(request):
    profile = get_object_or_404(UserProfile, user=request.user)
    orders = profile.orders.all()
    template = 'profiles/profile.html'
    context = {
        'profile': profile,
        'orders': orders,
    }
    return render(request, template, context)

def order_history(request, order_number):
    order = get_object_or_404(Order, order_number=order_number)
    template = 'profiles/order_history.html'
    context = {
        'order': order,
        'from_profile': True,
    }
    return render(request, template, context)

