# Generated by Django 2.1.3 on 2018-11-16 03:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menus', '0035_auto_20181116_0113'),
    ]

    operations = [
        migrations.AlterField(
            model_name='primarytype',
            name='name',
            field=models.CharField(max_length=120, unique=True),
        ),
        migrations.AlterField(
            model_name='secondarytype',
            name='name',
            field=models.CharField(max_length=120, unique=True),
        ),
    ]
