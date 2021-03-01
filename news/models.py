# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from datetime import datetime
# Create your models here.

class News(models.Model):
    CATEGORY_TYPE = (
        (1, "一级板块"),
        (2, "二级板块"),
        (3, "三级板块"),
    )
    board_rank = models.IntegerField(default=1,choices=CATEGORY_TYPE)  #板块级别
    url = models.URLField(max_length=50) #链接
    title = models.CharField(max_length=256,null=True)  #标题
    content = models.TextField(null=True)  # 正文
    signature = models.CharField(max_length=30,null=True,blank=True) #网页标识
    source = models.CharField(max_length=30)  #新闻来源
    time = models.DateTimeField(default=datetime.now)#新闻入库时间
    acthor = models.CharField(max_length=10)#发布者
    auditor = models.CharField(max_length=10)#审核人
    commentable = models.IntegerField(default=0)#评论数
    hit = models.IntegerField(default=0)#阅读数
    isAvailable = models.BooleanField(default=False)    #是否可用
    isTop = models.BooleanField(default=False) #是否置顶
    isLink = models.BooleanField(default=False) # 是否链接
    isEmergency =  models.BooleanField(default=False) # 是否紧急
    isHot = models.BooleanField(default=False)  # 是否属于热点新闻
    def __str__(self):
        return self.title

    class Meta:
        db_table = 'news_information'
        # verbose_name = '新闻信息'
        # verbose_name_plural = verbose_name