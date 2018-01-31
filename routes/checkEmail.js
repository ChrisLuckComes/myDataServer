var express = require('express')
var router = express.Router()
const url = require('url')
const query = require('../pool')

/*检查邮箱是否已注册过*/
router.get('/', function(req, res, next) {
    var email = url.parse(req.url, true).query.email
    var sql=`select count(*) num from User where id="${email}"`
    console.log(sql)
    query(sql,null, (err, result, fields)=>{
        console.log(result)
        if (err)
            throw err
        else 
            if(result[0].num==0){
                res.send('unregistered')
            }else{
                res.send('registered')
            }
    })
});

module.exports = router;
