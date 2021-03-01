# -*- coding: utf-8 -*-
import json


def pretty_print(content):
    """
    格式化输出python对象，主要包括list、dict
    :param content:
    :return: None
    """
    print json.dumps(content, encoding='utf-8', ensure_ascii=False, indent=4)


def pretty_print_format(content):
    """
    返回json格式化python对象，主要包括list、dict
    :param content:
    :return: json
    """
    return json.dumps(content, encoding='utf-8', ensure_ascii=False, indent=4)


def generate_print_hint_by_number(number=10, character='#'):
    """
    根据number个数生成打印字符character的数量
    :param number:         打印的个数
    :param character:      打印的字符
    :return:
    """
    s = ''
    for i in range(number):
        s = s + str(character)
    return s


def print_format_header(header_str, character='#', number=20, retract=0):
    """
    打印特定格式的开始分隔符  如：number of '#' + header_str + number of '#'
    :param header_str:   标识功能的字符串
    :param character:    特定的字符
    :param number:       特定字符开始和结尾答应的数量
    :param retract:      需要缩进的tab数量
    :return:
    """
    print_with_retract('\n' + generate_print_hint_by_number(number, character=character) + header_str + generate_print_hint_by_number(number, character=character), retract)


def print_format_tail(header_str, character='#', number=20, retract=0):
    """
    打印特定格式的结束分隔符  如：number of '#' + len(header_str) of '#' + number of '#'
    :param header_str:   标识功能的字符串
    :param character:    特定的字符
    :param number:       特定字符开始和结尾答应的数量
    :param retract:      需要缩进的tab数量
    :return:
    """
    print_with_retract(generate_print_hint_by_number(number*2 + str(header_str).__len__(), character=character) + '\n', retract)


def print_with_retract(print_data, retract=0):
    """
    带缩进（tab）打印
    :param print_data:     要打印的数据
    :param retract:    需要缩进的tab数量
    :return:
    """
    if retract != 0:
        tab = ""
        for i in range(retract):
            tab += "    "
        print tab, print_data
    else:
        print print_data


if __name__ == '__main__':
    t = ({'a': 1, 'b': 2}, {'a': 1, 'b': 2})

    pretty_print(json.loads(json.dumps(t)))

    pretty_print(isinstance(t, list))
    pretty_print(isinstance(json.loads(json.dumps(t)), list))

    t = {'aaaa': t[0], 'bbbb': t[1]}
    pretty_print(t)

    print json.dumps(json.dumps(json.dumps(t)))
    print json.dumps(json.dumps(t))
    print json.dumps(t)
    print t


