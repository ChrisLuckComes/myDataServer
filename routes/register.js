const moment = require('moment')
var express = require('express')
var router = express.Router()
const url = require('url')
const query = require('../pool')
const nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport({
    service: 'qq',
    auth: {
        user: '313963196@qq.com',
        pass: 'ylkduooccqfybicf'
    }
})
var mailOptions = {
    from: '313963196@qq.com',
    to: '',
    subject: "Lyl's useful tools 账号激活",
    text: '点击下面链接激活:',
    html: ''
}


/*注册*/
router.post('/', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log(req.body)
    var param = req.body
    var id = param.id
    var name = param.name
    var password = param.password
    var insertSql = `insert into User values("${id}","${name}","${password}",now(),0)`
    query(insertSql, null, (err, result, fields) => {
        if (err)
            throw err
        else {
            res.send(true)
            mailOptions.to = id
            mailOptions.html = `<h3><a href="http://192.168.30.252:8081/active?id=${id.toString('base64')}">
            http://192.168.30.252:8081/active?id=${new Buffer(id).toString('base64')}</a></h3>`
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err)
                }
                console.log('发送成功')
            })
        }
    })

});

module.exports = router;
