# -*- coding: utf-8 -*-
# @Time    : 2018/07/30 15:48
# @Author  : Zeng.YS
# @File    : request_util.py
# @Software: PyCharm
from django.http import HttpResponse
import print_util as pu
import json
from rest_framework import status

def get_request_data(request):
    """处理请求"""
    request_param = {}
    if request.method == 'GET':
        request_param = request.GET
    elif request.method == 'POST':
        request_param = request.POST

    # print(request.method, pu.pretty_print_format(request_param))
    return request_param

##处理响应
def message_response(code, message,status_code = 0, is_print = 1):
    """
    自定义UI响应消息.
    :param code:               响应消息编码（自定义）
    :param message:            响应信息（请求用户查看）
    :param status_code:        响应状态码
    :param headers:            响应头
    :return:                   a REST framework's Response object
    """
    resp_data = {
        'code': code,
        'msg': message,
    }
    if status_code == 0:
        status_code = code


    # if status_code != status.HTTP_200_OK:
    #     print '[ Error ] %d: %s' % (code, str(message)[:500] if is_print else '......')
    #     # HttpResponseServerError()
    # else:
    #     print '[ Success ] %d: %s' % (code, str(message)[:500] if is_print else '......')
    resp = json.dumps(resp_data, ensure_ascii=False) #.encode('utf-8') #不加效果一致

    #print 'response:',resp[:800]
    print(resp)
    return HttpResponse(resp, status=status_code,content_type="application/json;charset=utf-8")