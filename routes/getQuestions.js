var express = require('express')  
var router = express.Router();

const url = require('url')
const MongoClient = require('mongodb').MongoClient
const murl = "mongodb://127.0.0.1:27017"

router.get('/',(req,res,next)=>{
    var key = url.parse(req.url, true).query.key
    console.log(`试卷编号：${key}`)
    MongoClient.connect(murl,(err,client)=>{
        var col=client.db('questions').collection('test')
        col.find({test:+key}).toArray((err,arr)=>{
            console.log(arr)
            client.close()
            res.send(arr)                            
        })         
    }) 
})

module.exports = router
