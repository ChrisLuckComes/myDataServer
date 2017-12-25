const moment = require('moment')
var express = require('express')
var router = express.Router()
const url = require('url')
const query = require('../pool')

/*注册*/
router.post('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log(req.body)
    var param=req.body
    var id=param.id
    var name=param.name
    var password=param.password
    var insertSql=`insert into User values("${id}","${name}","${password}",now(),0)`
    query(insertSql,null, (err, result, fields)=>{
        if (err)
            throw err
        else 
            res.send(true)
    })
});

module.exports = router;
