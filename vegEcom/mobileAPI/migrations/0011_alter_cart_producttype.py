# Generated by Django 3.2.2 on 2021-06-10 06:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mobileAPI', '0010_auto_20210515_1152'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='productType',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='CartProductTypes', to='mobileAPI.type'),
        ),
    ]
