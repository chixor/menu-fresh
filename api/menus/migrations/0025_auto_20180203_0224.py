# Generated by Django 2.0.1 on 2018-02-03 02:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menus', '0024_ingredients_purchased'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ingredients',
            name='purchased',
        ),
        migrations.AddField(
            model_name='shoppinglist',
            name='purchased',
            field=models.BooleanField(default=False),
        ),
    ]