#coding:utf-8
import re
import requests
import sys

money1=sys.argv[1].decode('GBK').encode('utf-8') 
money2=sys.argv[2].decode('GBK').encode('utf-8') 
url = 'http://www.boc.cn/sourcedb/whpj/index.html' # 网址 
html = requests.get(url).content.decode('utf8').encode('utf-8') # 获取网页源码

#方式一：正则匹配
def getMoneyInfo(money): 
    if money=='人民币':
        return ['人民币',100]
    a = html.index('<td>'+money+'</td>') # 取得货币当前位置 
    s = html[a:a + 300] # 截取货币汇率那部分内容（从a到a+300位置） 
    result = re.findall('<td>(.*?)</td>', s) # 正则获取 
    return result 
print((getMoneyInfo(money1)),getMoneyInfo(money2)) 
