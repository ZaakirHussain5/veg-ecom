# Generated by Django 3.2.4 on 2021-08-07 08:43

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('webAPI', '0009_alter_invoicecharges_invoice'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usercreditledger',
            name='transactionDateTime',
            field=models.DateTimeField(default=datetime.datetime(2021, 8, 7, 8, 43, 36, 172632, tzinfo=utc)),
        ),
    ]