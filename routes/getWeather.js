const express = require('express');
const router = express.Router();
const cp = require('child_process')
const crypto = require('crypto')
const queryString = require('querystring')
const request = require('request-promise')
const url = require('url')
const moment = require('moment')
const URL = 'https://api.seniverse.com/v3/weather';

function getSignature() {
    var params = {}
    params.ts = Math.floor(new Date().getTime() / 1000)//时间戳
    params.ttl = 300//过期时间
    params.uid = 'U39492A334'
    var str = queryString.encode(params)
    //使用 HMAC-SHA1 方式，以API密钥（key）对上一步生成的参数字符串进行加密
    params.sig = crypto.createHmac('sha1', 'dkslndgumyjwrsxx')
        .update(str).digest('base64')// 将加密结果用 base64 编码，并做一个 urlencode，得到签名 sig
    return params
}

async function getWeather(type, params) {
    var option = {
        url: URL,
        qs: params,
        json: true
    }
    type == 'now' ? option.url += '/now.json' : option.url += '/daily.json'
    return new Promise((resolve, reject) =>
        request(option).then(ret => resolve(ret)).catch(err => reject(err))
    )
}
router.get('/', (req, res, next) => {
    var params = getSignature()
    params.location = 'ip'
    var reqData = url.parse(req.url, true).query
    let city
    //获取城市
    cp.exec(`python getCity.py`, (err, stdout, stderr) => {
        if (err) console.log('stderr', err);
        if (stdout) {
            city = stdout.split('省')[1].split('市')[0]
            //获取天气数据
            ~async function () {
                let now, daily
                if (reqData.type == 'now') {//即时天气
                    now = await getWeather('now', params)
                    var nowData = now.results[0].now
                    nowData.city = now.results[0].location.name
                    res.send(nowData)
                } else if (reqData.type == 'daily') {//一周天气
                    request(`http://www.sojson.com/open/api/weather/json.shtml?city=${encodeURI(city)}`).then(ret => {
                        res.send(ret)
                    })
                } else if (reqData.type == 'lunar') {//农历
                    request(`http://www.sojson.com/open/api/lunar/json.shtml?
                date=${moment().format('YYYY-MM-DD').toString()}`,
                    ).then(ret => res.send(ret))
                }
            }(city)
        }
    })
})

module.exports = router;
