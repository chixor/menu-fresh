# Generated by Django 2.1.3 on 2018-11-19 02:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('menus', '0039_auto_20181119_0210'),
    ]

    operations = [
        migrations.AddField(
            model_name='accountingredient',
            name='category',
            field=models.ForeignKey(default=8, on_delete=django.db.models.deletion.PROTECT, to='menus.SupermarketCategory'),
        ),
    ]
