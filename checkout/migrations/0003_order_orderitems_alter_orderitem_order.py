# Generated by Django 5.0.6 on 2024-05-30 02:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('checkout', '0002_alter_order_country'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='orderitems',
            field=models.ManyToManyField(related_name='orders', to='checkout.orderitem'),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='checkout.order'),
        ),
    ]
