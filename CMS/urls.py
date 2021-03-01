# -*- coding: utf-8 -*-

"""CMS URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from news.views import index,backstage,add_news,test,show_news,del_news,count_news,news_list,news_detail
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^test/?$',test,name='test'),
    # 首页
    url(r'^$',index,name='index'),
    # 列表页
    url(r'^news_list/?$',news_list,name='news_list'),
    # 详情页
    url(r'^news_detail/?$',news_detail,name='news_detail'),

    url(r'^backstage/?$',backstage,name='backstage'), #后台管理
    # url(r'^backstage/add/?$',add,name='add'),
    url(r'^backstage/add_news/?$',add_news,name='add_news'),
    url(r'^backstage/show?$', show_news, name='show_news'),
    url(r'^backstage/count/?$', count_news, name='count_news'),
    url(r'^backstage/del/?$', del_news, name='del_news'),

]
