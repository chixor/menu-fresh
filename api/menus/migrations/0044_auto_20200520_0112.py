# Generated by Django 2.1.3 on 2020-05-20 01:12

from django.db import migrations, models
import django.db.models.deletion

def add_pantry_categories(apps, schema_editor):
    PantryCategory = apps.get_model('menus', 'PantryCategory')
    PantryCategory.objects.create(name='pantry')
    PantryCategory.objects.create(name='kitchen cupboard')
    PantryCategory.objects.create(name='fridge')
    PantryCategory.objects.create(name='freezer')
    PantryCategory.objects.create(name='breezeway cupboard')
    PantryCategory.objects.create(name='garden')
    PantryCategory.objects.create(name='other')

class Migration(migrations.Migration):

    dependencies = [
        ('menus', '0043_shoppinglist_ingredient'),
    ]

    operations = [
        migrations.CreateModel(
            name='PantryCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, unique=True)),
            ],
        ),
        migrations.RunPython(add_pantry_categories),
        migrations.RenameField(
            model_name='accountingredient',
            old_name='category',
            new_name='supermarketCategory',
        ),
        migrations.RenameField(
            model_name='ingredient',
            old_name='category',
            new_name='supermarketCategory',
        ),
        migrations.RemoveField(
            model_name='shoppinglist',
            name='ingredient',
        ),
        migrations.AlterField(
            model_name='recipeweek',
            name='week',
            field=models.SmallIntegerField(default=21),
        ),
        migrations.AlterField(
            model_name='recipeweek',
            name='year',
            field=models.SmallIntegerField(default=2020),
        ),
        migrations.AlterField(
            model_name='shoppinglist',
            name='week',
            field=models.SmallIntegerField(default=21),
        ),
        migrations.AlterField(
            model_name='shoppinglist',
            name='year',
            field=models.SmallIntegerField(default=2020),
        ),
        migrations.AddField(
            model_name='accountingredient',
            name='pantryCategory',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='menus.PantryCategory'),
        ),
        migrations.AddField(
            model_name='ingredient',
            name='pantryCategory',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='menus.PantryCategory'),
        ),
    ]