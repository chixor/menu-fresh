# Generated by Django 2.1.3 on 2020-05-20 12:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('menus', '0044_auto_20200520_0112'),
    ]

    operations = [
        migrations.AddField(
            model_name='shoppinglist',
            name='stockcode',
            field=models.IntegerField(null=True),
        ),
    ]