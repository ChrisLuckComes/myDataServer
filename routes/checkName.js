var express = require('express')
var router = express.Router()
const url = require('url')
const query = require('../pool')

/*检查昵称是否被使用*/
router.get('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    var name = url.parse(req.url, true).query.name
    var sql=`select count(*) num from User where name="${name}"`
    console.log(`查询语句：${sql}`)
    query(sql,null, (err, result, fields)=>{
        console.log(`查询结果${result}`)
        if (err)
            console.log(err)
        else 
            if(result[0].num==0){
                res.send('unused')
            }else{
                res.send('used')
            }
    })
});

module.exports = router;
