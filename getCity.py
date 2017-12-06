# -*- coding: utf-8 -*-
import requests
from lxml import etree 

url='http://ip.cn/' #请求ip.cn 从网页上抓取城市名
html = requests.get(url).content # 获取网页源码
page = etree.HTML(html.lower())
divs = page.xpath(u"//div")
for div in divs:
    if div.get('class')=='well':
        print(div[1][0].text.encode('utf8'))



