# Generated by Django 5.1.4 on 2025-01-09 21:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_pandsdocument_last_upserted'),
    ]

    operations = [
        migrations.CreateModel(
            name='RephraseHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('history', models.TextField()),
                ('last_updated', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
