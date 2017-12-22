var express = require('express');
var router = express.Router();
const url = require('url')
const query = require('../pool')

/*登陆*/
router.post('/', function(req, res, next) {
    console.log(req.body)
    var id=req.body.id
    var password=req.body.password
    var sql=`select password,isActive from User where id="${id}"`
    query(sql,null, (err, result, fields)=>{
        if (err)
            throw err
        else 
            if(result[0]==password){
                req.session.id=id
                req.cookies.isActive=result[1]
                res.send({status:'true',isActive:result[1]})              
            }else{
                res.send({status:'false'})
            }
    })
});

module.exports = router;
