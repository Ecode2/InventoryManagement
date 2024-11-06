# Generated by Django 5.1.2 on 2024-11-06 06:12

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("sales", "0002_remove_delievery_customer_remove_delievery_warehouse_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="sale",
            name="sale_uuid",
            field=models.UUIDField(default=uuid.uuid1, editable=False, unique=True),
        ),
    ]
