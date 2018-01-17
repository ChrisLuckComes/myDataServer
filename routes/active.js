const moment = require('moment')
var express = require('express')
var router = express.Router()
const url = require('url')
const query = require('../pool')

router.get('/',(req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    var id = url.parse(req.url, true).query.id
    query(`update user set isActive=1 where id=${id}`,null,(err, result, fields) =>{
        if(err)
          throw err
        else{
            res.send(true)
            console.log('激活成功')
        }
    })
})

module.exports = router;
