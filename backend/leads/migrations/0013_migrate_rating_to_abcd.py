from django.db import migrations, models


def _forwards(apps, schema_editor):
    """Map legacy temperature-based ratings to the new A/B/C/D tiers."""
    Lead = apps.get_model("leads", "Lead")
    mapping = {
        "HOT": "A",  # High value
        "WARM": "B",  # Potential
        "COLD": "D",  # Low value (C = Watching is new, no legacy data)
    }
    for old, new in mapping.items():
        Lead.objects.filter(rating=old).update(rating=new)


def _reverse(apps, schema_editor):
    Lead = apps.get_model("leads", "Lead")
    mapping = {
        "A": "HOT",
        "B": "WARM",
        "D": "COLD",
    }
    for new, old in mapping.items():
        Lead.objects.filter(rating=new).update(rating=old)


class Migration(migrations.Migration):
    dependencies = [
        ("leads", "0012_lead_kanban_pipeline"),
    ]

    operations = [
        migrations.AlterField(
            model_name="lead",
            name="rating",
            field=models.CharField(
                blank=True,
                choices=[
                    ("A", "A - High Value"),
                    ("B", "B - Potential"),
                    ("C", "C - Watching"),
                    ("D", "D - Low Value"),
                ],
                max_length=10,
                null=True,
                verbose_name="Rating",
            ),
        ),
        migrations.RunPython(_forwards, _reverse),
    ]
