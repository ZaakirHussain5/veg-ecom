# Generated by Django 3.2.4 on 2021-07-31 06:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mobileAPI', '0016_deliverytype'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='isInvoiceCreated',
            field=models.BooleanField(default=False),
        ),
    ]
