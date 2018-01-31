const moment = require('moment')
var express = require('express')
var router = express.Router()
const url = require('url')
const query = require('../pool')

router.get('/',(req,res,next)=>{
    var id = url.parse(req.url, true).query.id
    var sql=`update user set isActive=1 where id='${new Buffer(id,'base64').toString()}'`
    console.log(sql)
    query(sql,null,(err, result, fields) =>{
        if(err)
          throw err
        else{
            res.send(true)
            console.log('激活成功')
        }
    })
})

module.exports = router;
