# Generated by Django 2.1.3 on 2018-11-16 01:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menus', '0033_auto_20181115_0517'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipe',
            name='back',
        ),
        migrations.RenameField(
            model_name='recipe',
            old_name='front',
            new_name='filename',
        )
    ]
