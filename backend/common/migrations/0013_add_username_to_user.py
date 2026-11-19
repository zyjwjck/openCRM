from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0012_add_tag_color_description_isactive"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="username",
            field=models.CharField(
                blank=True,
                max_length=150,
                null=True,
                verbose_name="username",
            ),
        ),
    ]
