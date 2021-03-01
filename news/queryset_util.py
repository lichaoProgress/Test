# -*- coding: utf-8 -*-
from django.db.models.query import QuerySet
import json
import datetime
import traceback


#  列表去重 保持原列表顺序
def list_remove_repetition_in_order(source_list):
    """
    remove repetition items from list keep its order
    :param source_list: original list
    :return: new_list: the non-repeating、original order list
    """
    new_list = list(set(source_list))
    new_list.sort(key=source_list.index)
    return new_list

class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        else:
            return json.JSONEncoder.default(self, obj)

def get_dict_of_model(obj):
    res = {}
    for attr_name in dir(obj):
        try:
            attr = getattr(obj, attr_name)
            if callable(attr):
                # method
                continue
        except AttributeError:
            continue
        res[attr_name] = attr
    return res


def get_dict_of_model_objet(obj, fields=(), excludes=()):
    attrs = get_dict_of_model(obj)
    res = {}
    for attr_name, attr in attrs.items():
        if str(attr_name).startswith("_") or attr_name == "pk":
            continue
        if str(attr_name) in fields or len(fields) == 0:
            res[attr_name] = attr
        if str(attr_name) in excludes:
            res.pop(attr_name)

    s = json.dumps(res, cls=CJsonEncoder, encoding='utf-8')
    return json.loads(s, encoding='utf-8')




#将queryset转化为json字符串
def get_json_of_queryset(queryset, fields=(), excludes=()):
    """
    作用：将queryset转化为json字符串
    :param queryset: 数据库查询的queryset结果
    :param fields: 需要保留的字段名的元祖
    :param excludes: 需要排除的字段名的元祖
    :return: 查询结果的json字符串
    注意事项：excludes参数存在时fields参数无效
    """
    if not queryset.exists():
        return '[]'
    if excludes:
        fields = set(queryset.values()[0].keys()) - set(excludes)
    lst = list(queryset.values(*fields))
    return json.dumps(lst, cls=CJsonEncoder, encoding='utf-8')

#将queryset转化为list对象
def get_list_of_queryset(queryset, fields=(), excludes=(), time_serialize=1):
    """
    作用：将queryset转化为list对象
    :param queryset: 数据库查询的queryset结果
    :param fields: 需要保留的字段名的元祖
    :param excludes: 需要排除的字段名的元祖
    :param time_serialize:
    :return:  查询结果的list对象
    注意事项：excludes参数存在时fields参数无效
    """
    if not queryset.exists():
        return []
    if excludes:
        fields = set(queryset.values()[0].keys()) - set(excludes)
    lst = list(queryset.values(*fields))
    if time_serialize:
        s = json.dumps(lst, cls=CJsonEncoder, encoding='utf-8')
        return json.loads(s, encoding='utf-8')
    else:
        return lst

#获取queryset中指定单个字段列表
def get_query_field_list(queryset,field):
    """
    作用：获取queryset中指定单个字段列表
    :param queryset: 数据库查询的queryset结果
    :param field: 指定转换成列表的字段
    :return: 指定字段的列表
    """
    list_queryset = get_list_of_queryset(queryset,fields=('id',field))
    return [item[field] for item in list_queryset]

#将queryset转化为dict对象
def get_dict_of_queryset(queryset, key_field='id', values_field=None):
    """
    作用： 将queryset转化为dict对象
    :param queryset: 数据库查询的queryset结果
    :param key_field: 需要作为字典key值的字段名
    :param values_field: 需要作为字典values值的字段名
    :return: 查询结果的dict对象
    """
    if not queryset.exists():
        return {}
    lst = list(queryset.values())
    if not (lst[0].has_key(key_field) and lst[0].has_key(values_field)):
        return {}
    dic = {}
    for d in lst:
        key = d[key_field]
        value = d[values_field]
        dic[key] = value
    return dic

#将queryset转化为dict对象
def get_dict_of_queryset_dict(queryset, key_field='id'):
    """
     作用：将queryset转化为dict对象
    :param queryset: 数据库查询的queryset结果
    :param key_field: 需要作为字典key值的字段名，value为整个字典
    :return: 查询结果的dict对象
    """
    if not queryset.exists():
        return {}
    lst = list(queryset.values())
    if not lst[0].has_key(key_field):
        return {}
    dic = {}
    for d in lst:
        key = d[key_field]
        value = d
        dic[key] = value
    return dic

#获取界面显示每页起始条目和每页条数
def get_page_data(request_para):
    """
    作用：获取界面显示每页起始条目和每页条数
    :param request_para: 请求中的参数
    :return: 三元组:(起始数据位置， 末尾数据位置， 每页条数)
    """
    page_num = int(request_para.get('pn', 1))  # 页码，默认为第一页
    page_size = int(request_para.get('p_size', 10))  # 每页条数，默认为10

    start_pos = (page_num - 1) * page_size  # 每页起始条码
    end_pos = page_num * page_size  # 每页结束条码

    return start_pos, end_pos, page_size

# 根据外键获取依赖表fields字段信息(多对一)
def get_fields_detail_by_foreign_key(list_data, model, f_id, p_id, fields=()):
    """
    根据外键获取依赖表fields字段信息
    :param list_data:  包含外键信息的结果集（已分页数据）
    :param model:       依赖表
    :param f_id:        外键在list_data中的字段名
    :param p_id:        外键在依赖表中的字段名
    :param fields:      要获取信息的所有字段（包含p_id字段）
    :return:            dict(f_id/p_id字段值：fields所有字段和值的dict)
    """

    try:
        # if not query_data.exists():
        #     return {}
        # _f_ids = query_data.values_list(f_id)
        # f_ids = [item[0] for item in set(_f_ids)]
        if len(list_data) == 0:
            return {}
        #f_ids = [item[0] for item in set(_f_ids)]
        f_ids = [item[f_id] for item in list_data]

        p_ids_query_term = {p_id + '__in': f_ids}
        #print p_ids_query_term
        model_fields_info = model.objects.filter(**p_ids_query_term).values(*fields)
        #model_fields_info = model.objects.filter(p_id + '__in'=f_ids).values(*fields)
        print str(model_fields_info.query)
        p_id_fields_dict = {item[p_id]: item for item in model_fields_info}
        #print '8888888888',p_id_fields_dict
        #print '8888888888', len(p_id_fields_dict)
        return p_id_fields_dict
    except Exception:
        traceback.print_exc()

# 根据外键获取依赖表fields字段信息(一对多)
def get_fields_list_detail_by_foreign_key(list_data, model, f_id, p_id, fields=()):
    """
    根据外键获取依赖表fields字段信息
    :param list_data:  包含外键信息的结果集（已分页数据）
    :param model:       依赖表
    :param f_id:        外键在list_data中的字段名
    :param p_id:        外键在依赖表中的字段名
    :param fields:      要获取信息的所有字段（包含p_id字段）
    :return:            dict(f_id/p_id字段值：fields所有字段和值的dict)
    """

    try:
        # if not query_data.exists():
        #     return {}
        # _f_ids = query_data.values_list(f_id)
        if len(list_data) == 0:
            return {}
        #f_ids = [item[0] for item in set(_f_ids)]
        f_ids = [item[f_id] for item in list_data]

        p_ids_query_term = {p_id + '__in': f_ids}
        # print p_ids_query_term
        model_fields_info = model.objects.filter(**p_ids_query_term).values(*fields)
        # model_fields_info = model.objects.filter(p_id + '__in'=f_ids).values(*fields)
        print str(model_fields_info.query)
        p_id_fields_dict = {}
        for item in model_fields_info:
            if p_id_fields_dict.has_key(item[p_id]):
                p_id_fields_dict[item[p_id]].append(item)
            else:
                p_id_fields_dict[item[p_id]] = [item]
        # print '8888888888',p_id_fields_dict
        # print '8888888888', len(p_id_fields_dict)
        return p_id_fields_dict
    except Exception:
        traceback.print_exc()

# 根据外键获取依赖表fields字段信息(多对多，第二步，第一步用一对多)
def get_fields_detail_by_foreign_key_mul2mul(list_data, model, f_id, p_id, fields=()):
    """
    根据外键获取依赖表fields字段信息
    :param list_data:  包含外键信息的结果集（已分页数据）
    :param model:       依赖表
    :param f_id:        外键在list_data中的字段名
    :param p_id:        外键在依赖表中的字段名
    :param fields:      要获取信息的所有字段（包含p_id字段）
    :return:            dict(f_id/p_id字段值：fields所有字段和值的dict)
    """

    try:
        if len(list_data) == 0:
            return {}
        # _f_ids = query_data.values_list(f_id)
        # f_ids = [item[0] for item in set(_f_ids)]
        #f_ids = [item[f_id] for item in list_data]
        f_ids = []
        for item in list_data:
            f_ids.extend(item[f_id])
        #print f_ids
        f_ids = list_remove_repetition_in_order(f_ids)
        #print f_ids

        p_ids_query_term = {p_id + '__in': f_ids}
        # print p_ids_query_term
        model_fields_info = model.objects.filter(**p_ids_query_term).values(*fields)
        # model_fields_info = model.objects.filter(p_id + '__in'=f_ids).values(*fields)
        print str(model_fields_info.query)
        p_id_fields_dict = {item[p_id]: item for item in model_fields_info}
        # print '8888888888',p_id_fields_dict
        # print '8888888888', len(p_id_fields_dict)
        return p_id_fields_dict
    except Exception:
        traceback.print_exc()

# 根据附表字典填充主表数据(多对一)(内部用，不要调用)
def fill_field_from_dict(show_data, pick_dict, f_id, from_fields=[], to_fields=[], null_value=''):
    """
    根据附表字典填充主表数据
    :param show_data: 将来需要填充主表的数据(dict_type)
    :param pick_dict: 副表字典
    :param f_id:      副表在主表中的外键id
    :param from_fields:从副表字典取数据时 副表的key名称
    :param to_fields: 填充主表数据时  主表的Key名称
    :return:           None
    """
    try:
        f_value = show_data[f_id]
        #print '22222222222222222222:', f_value
        f_object = pick_dict.get(f_value, {})
        #print '33333333333333333333:', f_object
        if to_fields == []:
            to_fields = from_fields
        for i in range(len(from_fields)):
            #print '11111111111111111111:', i
            #print '11111111111111111111:', from_fields[i]
            show_data[to_fields[i]] = f_object.get(from_fields[i], null_value)
            #print '2222222222222222222:',show_data[to_fields[i]]
            #print '333333333333333333:',f_object[from_fields[i]]
    except Exception:
        traceback.print_exc()

# 根据附表字典填充主表数据(多对一)
def fill_field_from_dict_all(list_data, pick_dict, f_id, from_fields=[], to_fields=[], null_value=''):
    """
    根据附表字典填充主表数据
    :param show_data: 将来需要填充主表的数据(dict_type)
    :param pick_dict: 副表字典
    :param f_id:      副表在主表中的外键id
    :param from_fields:从副表字典取数据时 副表的key名称
    :param to_fields: 填充主表数据时  主表的Key名称
    :return:           None
    """
    try:
        #show_data = []
        for data in list_data:
            # fields = data['fields'	]
            fields = data
            fill_field_from_dict(show_data=fields, pick_dict=pick_dict, f_id=f_id,
                                  from_fields=from_fields,
                                  to_fields=to_fields,null_value=null_value)
            #show_data_tmp.append(fields)

    except Exception:
        traceback.print_exc()

# 根据附表字典填充主表数据(一对多)(内部用，不要调用)
def fill_field_list_from_dict(show_data, pick_dict, f_id, from_fields=[], to_fields=[]):
    """
    根据附表字典填充主表数据
    :param show_data: 将来需要填充主表的数据(dict_type)
    :param pick_dict: 副表字典
    :param f_id:      副表在主表中的外键id
    :param from_fields:从副表字典取数据时 副表的key名称
    :param to_fields: 填充主表数据时  主表的Key名称
    :return:           None
    """
    try:
        f_value = show_data[f_id]
        # print '22222222222222222222:', f_value
        f_object = pick_dict.get(f_value, [])
        # print '33333333333333333333:', f_object
        if to_fields == []:
            to_fields = from_fields
        for i in range(len(from_fields)):
            # print '11111111111111111111:', i
            # print '11111111111111111111:', from_fields[i]
            show_data[to_fields[i]] = [item[from_fields[i]] for item in f_object]
            # show_data = []
            # for item in f_object:
            #     if item.has_key(from_fields[i]):
            #         show_data[to_fields[i]] = item[from_fields[i]]
                    # print '2222222222222222222:',show_data[to_fields[i]]
                    # print '333333333333333333:',f_object[from_fields[i]]
    except Exception:
        traceback.print_exc()

# 根据附表字典填充主表数据(一对多)
def fill_field_list_from_dict_all(list_data, pick_dict, f_id, from_fields=[], to_fields=[]):
    """
    根据附表字典填充主表数据
    :param show_data: 将来需要填充主表的数据(dict_type)
    :param pick_dict: 副表字典
    :param f_id:      副表在主表中的外键id
    :param from_fields:从副表字典取数据时 副表的key名称
    :param to_fields: 填充主表数据时  主表的Key名称
    :return:           None
    """
    try:
        for data in list_data:
            # fields = data['fields'	]
            fields = data
            fill_field_list_from_dict(show_data=fields, pick_dict=pick_dict, f_id=f_id,
                                  from_fields=from_fields,
                                  to_fields=to_fields)
    except Exception:
        traceback.print_exc()

# 根据附表字典填充主表数据(多对多，第二步，第一步用一对多)(内部用，不要调用)
def fill_field_list_from_dict_mul2mul(show_data, pick_dict, f_id, from_fields=[], to_fields=[],null_value=''):
    """
    根据附表字典填充主表数据
    :param show_data: 将来需要填充主表的数据(dict_type)
    :param pick_dict: 副表字典
    :param f_id:      副表在主表中的外键id
    :param from_fields:从副表字典取数据时 副表的key名称
    :param to_fields: 填充主表数据时  主表的Key名称
    :return:           None
    """
    try:
        f_value = show_data[f_id]
        # print '22222222222222222222:', f_value
        #f_object = pick_dict.get(f_value, [])
        f_object = f_value
        # print '33333333333333333333:', f_object
        if to_fields == []:
            to_fields = from_fields
        for i in range(len(from_fields)):
            # print '11111111111111111111:', i
            # print '11111111111111111111:', from_fields[i]
            show_data[to_fields[i]] = [pick_dict.get(item, {}).get(from_fields[i], null_value) for item in f_object]
            #show_data[to_fields[i]] = [item for item in f_object]
            # show_data = []
            # for item in f_object:
            #     if item.has_key(from_fields[i]):
            #         show_data[to_fields[i]] = item[from_fields[i]]
                    # print '2222222222222222222:',show_data[to_fields[i]]
                    # print '333333333333333333:',f_object[from_fields[i]]
    except Exception:
        traceback.print_exc()

# 根据附表字典填充主表数据(多对多，第二步，第一步用一对多)
def fill_field_list_from_dict_mul2mul_all(list_data, pick_dict, f_id, from_fields=[], to_fields=[],null_value=''):
    """
    根据附表字典填充主表数据
    :param show_data: 将来需要填充主表的数据(dict_type)
    :param pick_dict: 副表字典
    :param f_id:      副表在主表中的外键id
    :param from_fields:从副表字典取数据时 副表的key名称
    :param to_fields: 填充主表数据时  主表的Key名称
    :return:           None
    """
    try:
        for data in list_data:
            # fields = data['fields'	]
            fields = data
            fill_field_list_from_dict_mul2mul(show_data=fields, pick_dict=pick_dict, f_id=f_id,
                                  from_fields=from_fields,
                                  to_fields=to_fields,null_value=null_value)
    except Exception:
        traceback.print_exc()

