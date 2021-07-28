# Generated by Django 3.2.2 on 2021-06-12 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mobileAPI', '0013_auto_20210610_1305'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderitem',
            name='qty',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='unit',
            field=models.CharField(default='BAGS', max_length=25),
        ),
    ]
