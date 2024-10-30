# Generated by Django 5.1.2 on 2024-10-29 18:36

import django.db.models.deletion
import products.models
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Category",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "sku",
                    models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
                ),
                ("bar_code", models.SlugField(default=None, null=True, unique=True)),
                ("name", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True, null=True)),
                ("recorder_quantity", models.IntegerField(blank=True, default=1)),
                (
                    "recorder_quantity_name",
                    models.CharField(default=None, max_length=100, null=True),
                ),
                (
                    "cost_price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=1000),
                ),
                (
                    "selling_price",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=1000),
                ),
                (
                    "weight",
                    models.DecimalField(
                        decimal_places=2, default=None, max_digits=1000, null=True
                    ),
                ),
                (
                    "height",
                    models.DecimalField(
                        decimal_places=2, default=None, max_digits=1000, null=True
                    ),
                ),
                (
                    "width",
                    models.DecimalField(
                        decimal_places=2, default=None, max_digits=1000, null=True
                    ),
                ),
                (
                    "depth",
                    models.DecimalField(
                        decimal_places=2, default=None, max_digits=1000, null=True
                    ),
                ),
                (
                    "refriderated",
                    models.DecimalField(
                        decimal_places=2, default=None, max_digits=1000, null=True
                    ),
                ),
                ("is_active", models.BooleanField(blank=True, default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "category",
                    models.ManyToManyField(
                        default=None, related_name="products", to="products.category"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ProductFile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "file",
                    models.FileField(
                        upload_to=products.models.handle_product_attachment_upload
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="files",
                        to="products.product",
                    ),
                ),
            ],
        ),
    ]
