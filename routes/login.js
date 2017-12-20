var express = require('express');
var router = express.Router();
const url = require('url')
const query = require('../pool')

/*登陆*/
router.get('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    var id=req.param.id
    var password=req.param.password
    var sql=`select password,isActive from User where id=${id}`
    query(sql,null, (err, result, fields)=>{
        if (err)
            throw err
        else 
            if(result[0]==password){
                req.session.id=id
                res.send({status:'true',isActive:result[1]})              
            }else{
                res.send({status:'false'})
            }
    })
});

module.exports = router;
