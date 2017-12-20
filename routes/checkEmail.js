var express = require('express')
var router = express.Router()
const url = require('url')
const query = require('../pool')

/*检查邮箱是否已注册过*/
router.get('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    var email = url.parse(req.url, true).query.email
    var sql=`select count(*) from User where id=${email}`
    query(insertSql,null, (err, result, fields)=>{
        if (err)
            throw err
        else 
            if(result==0){
                res.send('unregistered')
            }else{
                res.send('registered')
            }
    })
});

module.exports = router;
