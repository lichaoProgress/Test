# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import traceback

from django.db.models import Q
from django.shortcuts import render,HttpResponse
from django.http import JsonResponse

# Create your views here.

#  首页
from news.models import News
from news.queryset_util import get_list_of_queryset, get_page_data
from news.request_util import get_request_data, message_response


def test(request):
    request_param = get_request_data(request)
    name = request_param.get('name','')
    age = request_param.get('age', '')
    sex = request_param.get('sex', '')
    data = {
        'name':name,
        'age':age,
        'sex':sex,
    }
    return JsonResponse({'status':'ok','msg':data})

def index(request):
    # return HttpResponse('CMS')
    return render(request,'index.html')

def news_list(request):
    return render(request,'news_list.html')

def news_detail(request):
    return render(request,'detail.html')






# 后台管理
def backstage(request):

    return render(request,'backstage.html')

# def add(request):
#     return render(request,'add_news.html')

def add_news(request):
    try:
        if request.method == 'GET':
            return render(request, 'add_news.html')
        else:
            request_param = get_request_data(request)
            title = request_param.get('title', '')
            url = request_param.get('url', '')
            # signature = request_param.get('signature', '')
            source = request_param.get('source', '')
            acthor = request_param.get('acthor', '')
            content = request_param.get('content', '')
            isTop = request_param.get('isTop', '')
            isEmergency = request_param.get('isEmergency', '')
            isAvailable = request_param.get('isAvailable', '')
            isLink = request_param.get('isLink', '')
            board_rank = request_param.get('board_rank', '')

            # user = request_param.get('uuid', '')
            #
            # if not user:
            #     return message_response(400, '获取登录当前用户失败')
            if not title:
                return message_response(400, '标题不能为空')
            if not url:
                return message_response(400, '链接不能为空')
            # if not signature:
            #     return message_response(400, '标识不能为空')
            if not source:
                return message_response(400, '新闻来源不能为空')
            if not acthor:
                return message_response(400, '发布者不能为空')
            if not content:
                return message_response(400, '内容不能为空')
            if not isTop:
                return message_response(400, '请选择是否置顶')
            if not isEmergency:
                return message_response(400, '请选择是否紧急')
            if not isAvailable:
                return message_response(400, '请选择是否可用')
            if not isLink:
                return message_response(400, '请选择是否有链接')
            if not board_rank:
                return message_response(400, '请选择新闻级别')

            query_data = News.objects.filter(title=title)
            if query_data:
                return message_response(400, "标题已存在")
            else:
                insert_dict = {
                    'title': title,
                    'url': url,
                    # 'signature': signature,
                    'source': source,
                    'acthor': acthor,
                    'content': content,
                    'isTop': isTop,
                    'isEmergency': isEmergency,
                    'isAvailable': isAvailable,
                    'isLink': isLink,
                    'board_rank': board_rank,
                }

                News.objects.create(**insert_dict)
                # return message_response(200, '添加成功')
                return message_response(200, insert_dict)

                # return JsonResponse({'msg':insert_dict})

    except Exception:
        traceback.print_exc()
        return message_response(500, '添加失败')

def show_news(request):
    try:
        request_param = get_request_data(request)
        query_terms = {}

        # query_data = News.objects.filter(**query_terms)

        news_search_condition(query_terms, request_param)

        start_pos, end_pos, page_size = get_page_data(request_param)
        query_data = News.objects.filter(**query_terms)[start_pos:end_pos]

        # 获取搜索关键词
        # keyword = request_param.get('keyword', '')
        # print(keyword)
        # if keyword:
            # 过滤出所有标题中包含关键词的数据
            # query_data = query_data.filter(Q(title__icontains=keyword))
        serializer_data = get_list_of_queryset(query_data)
        # print(serializer_data)
        return message_response(200, serializer_data)
        # return JsonResponse({'msg':serializer_data})

    except Exception:
        traceback.print_exc()
        return message_response(500, '查找失败')

def count_news(request):
    try:
        request_param = get_request_data(request)
        query_terms={}

        news_count = News.objects.filter(**query_terms).count()

        return message_response(200, { "count" : news_count })

    except Exception:
        traceback.print_exc()
        return message_response(500, '查找失败')

def del_news(request):
    try:
        request_param = get_request_data(request)
        news_id = eval(request_param.get('news_id', ''))

        if news_id:
            News.objects.filter(id__in=news_id).delete()
            return message_response(200, "删除成功")
        else:
            return message_response(400, 'id不能为空')

    except Exception:
        traceback.print_exc()
        return message_response(500, '删除失败')

#通知搜索条件判断
def news_search_condition(query_terms,request_param):
    if 'title' in request_param:
        title = request_param.get('title')
        query_terms['title__contains'] = title

    # if 'date' in request_param:
    #     time = request_param.get('date')
    #     query_terms['date__gte'] = datetime.strptime(time, '%Y-%m-%d')
    #     query_terms['date__lt'] = datetime.strptime(time, '%Y-%m-%d') + timedelta(1)


