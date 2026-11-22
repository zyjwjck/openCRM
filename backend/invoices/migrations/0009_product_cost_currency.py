from django.db import migrations, models


def backfill_cost_currency(apps, schema_editor):
    Product = apps.get_model("invoices", "Product")
    Product.objects.filter(cost_currency__isnull=True).update(cost_currency=models.F("currency"))


class Migration(migrations.Migration):

    dependencies = [
        ("invoices", "0008_invoicelineitem_unit_cost_snapshot_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="cost_currency",
            field=models.CharField(
                blank=True,
                choices=[
                    ("USD", "USD, Dollar"),
                    ("EUR", "EUR, Euro"),
                    ("GBP", "GBP, Pound"),
                    ("INR", "INR, Rupee"),
                    ("CAD", "CAD, Dollar"),
                    ("AUD", "AUD, Dollar"),
                    ("JPY", "JPY, Yen"),
                    ("CNY", "CNY, Yuan"),
                    ("CHF", "CHF, Franc"),
                    ("SGD", "SGD, Dollar"),
                    ("AED", "AED, Dirham"),
                    ("BRL", "BRL, Real"),
                    ("MXN", "MXN, Peso"),
                ],
                max_length=3,
                null=True,
            ),
        ),
        migrations.RunPython(backfill_cost_currency, migrations.RunPython.noop),
    ]
