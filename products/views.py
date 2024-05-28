from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.contrib import messages
from django.db.models import Q
from django.db.models.functions import Lower
from .models import Product, Category

def all_products(request):
    products = Product.objects.all()
    query = None
    categories = None
    sort = None
    direction = None

    if request.GET:
        if 'category' in request.GET:
            categories = request.GET['category'].split(',')
            products = products.filter(category__name__in=categories)
            categories = Category.objects.filter(name__in=categories)

        if 'q' in request.GET:
            query = request.GET['q']
            if not query:
                messages.error(request, "You didn't enter any search criteria!")
                return redirect(reverse('products'))
            
            queries = Q(name__icontains=query) | Q(description__icontains=query)
            products = products.filter(queries)

        if 'sort' in request.GET:
            sort = request.GET['sort']
            direction = request.GET.get('direction', 'asc')  # Default to ascending if not provided

            print('Sort:', sort, 'Direction:', direction)  # Debug log

            if sort == 'name':
                sortkey = 'name'
            elif sort == 'price':
                sortkey = 'price'
            elif sort == 'category':
                sortkey = 'category__name'
            else:
                sortkey = 'id'

            if direction == 'desc':
                sortkey = f'-{sortkey}'
            
            products = products.order_by(sortkey)

    context = {
        'products': products,
        'search_term': query,
        'current_categories': categories,
        'current_sorting': f'{sort}_{direction}' if sort and direction else 'None_None',
    }

    return render(request, 'products/products.html', context)



def product_detail(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    return render(request, 'products/product_detail.html', {'product': product})

def category_view(request, category_name):
    category = get_object_or_404(Category, name=category_name)
    products = Product.objects.filter(category=category)
    return render(request, 'products/products.html', {'products': products, 'current_category': category})
