# Generated by Django 2.0.1 on 2018-02-02 05:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('menus', '0019_auto_20180202_0441'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='supermarketwoolworth',
            name='category',
        ),
        migrations.RemoveField(
            model_name='supermarketwoolworth',
            name='ingredient',
        ),
        migrations.AddField(
            model_name='ingredients',
            name='category',
            field=models.ForeignKey(default=8, on_delete=django.db.models.deletion.PROTECT, to='menus.SupermarketCategory'),
        ),
        migrations.AddField(
            model_name='ingredients',
            name='cost',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='ingredients',
            name='stockcode',
            field=models.SmallIntegerField(null=True),
        ),
        migrations.DeleteModel(
            name='SupermarketWoolworth',
        ),
    ]
