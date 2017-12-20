var express = require('express')
var router = express.Router()
const url = require('url')
const query = require('../pool')

/*检查昵称是否被使用*/
router.get('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    var name = url.parse(req.url, true).query.name
    var sql=`select count(*) from User where name=${name}`
    query(insertSql,null, (err, result, fields)=>{
        if (err)
            throw err
        else 
            if(result==0){
                res.send('unused')
            }else{
                res.send('used')
            }
    })
});

module.exports = router;
