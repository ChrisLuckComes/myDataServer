# coding:utf-8
import re
import requests

url = 'http://www.boc.cn/sourcedb/whpj/index.html'  # 网址
html = requests.get(url).content.decode('utf8').encode('utf-8')  # 获取网页源码

# 方式一：正则匹配

def getMoneyInfo(moneyArr):
    arr = {}
    for m in moneyArr:
        if m == '人民币':
            arr['CNY'] = 100
        else:
            a = html.index('<td>' + m + '</td>')  # 取得货币当前位置
            s = html[a:a + 300]  # 截取货币汇率那部分内容（从a到a+300位置）
            result = re.findall('<td>(.*?)</td>', s)[5]  # 正则获取
            if m == '美元':
                arr['USD'] = result
            elif m == '日元':
                arr['JPY'] = result
            elif m == '欧元':
                arr['EUR'] = result
            elif m == '英镑':
                arr['GBP'] = result
            elif m == '港币':
                arr['HKD'] = result
    return arr

print(getMoneyInfo(['人民币', '美元', '英镑', '日元', '欧元', '港币']))
