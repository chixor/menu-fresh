# Generated by Django 2.1.3 on 2020-05-20 13:05

from django.db import migrations

def fix_historical_shopping_lists(apps, schema_editor):
    ShoppingList = apps.get_model('menus', 'ShoppingList')
    items = ShoppingList.objects.all().values('id','recipeIngredient_id','recipeIngredient__ingredient__accountingredient__stockcode','recipeIngredient__ingredient__accountingredient__supermarketCategory')
    for item in items:
        if item['recipeIngredient_id'] is not None:
            ShoppingList.objects.filter(id=item['id']).update(stockcode=item['recipeIngredient__ingredient__accountingredient__stockcode'],supermarketCategory=item['recipeIngredient__ingredient__accountingredient__supermarketCategory'])

class Migration(migrations.Migration):

    dependencies = [
        ('menus', '0046_auto_20200520_1234'),
    ]

    operations = [
        migrations.RunPython(fix_historical_shopping_lists),
    ]