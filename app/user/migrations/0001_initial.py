# Generated by Django 3.1.1 on 2020-11-09 22:25

from django.db import migrations


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authtoken', '0002_auto_20160226_1747'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExpiringToken',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('authtoken.token',),
        ),
    ]
