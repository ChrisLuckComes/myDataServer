var express = require('express')  
var router = express.Router();
const url = require('url')
const query = require('../pool')
const MongoClient = require('mongodb').MongoClient
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const murl = "mongodb://127.0.0.1:27017"


/*登陆*/
router.post('/', function (req, res, next) {
    if (req.session.user) {
        res.send(req.session.user)
    } else {
        var id = req.body.id
        var password = req.body.password
        var sql = `select password,name,isActive from User where id="${id}"`
        console.log(sql)
        query(sql, null, (err, result, fields) => {
            console.log(result)
            if (err)
                throw err
            else
                if (result[0].password == password) {
                    MongoClient.connect(murl,(err,client)=>{
                        var sessions=client.db('session').collection('sessions')
                        sessions.find({session:{$regex:new RegExp(id)}}).toArray((err,arr)=>{
                            if(arr.length){
                                new MongoStore({url:murl+"/session"}).destroy(arr[0]._id)
                            }
                            client.close()
                            req.session.user = { id: id, password: password, isActive: result[0].isActive, name: result[0].name }                   
                            res.cookie('id', id, { expires: new Date(Date.now() + 900000), httpOnly: true })
                            res.cookie('isActive', result[0].isActive, { expires: new Date(Date.now() + 900000), httpOnly: true });
                            res.cookie('name', result[0].name, { expires: new Date(Date.now() + 900000), httpOnly: true });
                            res.send({ status: true, id: id, isActive: result[0].isActive, name: result[0].name })                            
                        })                 
                    })                    
                } else {
                    res.send({ status: false })
                }
        })
    }

});

module.exports = router;
