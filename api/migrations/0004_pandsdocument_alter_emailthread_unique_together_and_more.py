# Generated by Django 5.1.4 on 2025-01-08 16:26

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_emailthread_unique_together'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PandSDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document', models.TextField()),
                ('last_updated', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='emailthread',
            unique_together=set(),
        ),
        migrations.AddConstraint(
            model_name='emailthread',
            constraint=models.UniqueConstraint(fields=('staff', 'customer_name'), name='unique_customer_per_staff'),
        ),
    ]
