# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from news.models import News


class NewsAdmin(admin.ModelAdmin):
    list_display = ['url','title','source']

admin.site.register(News,NewsAdmin)