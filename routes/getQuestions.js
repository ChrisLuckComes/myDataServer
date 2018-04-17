var express = require('express')
var router = express.Router();

const url = require('url')
const MongoClient = require('mongodb').MongoClient
const murl = "mongodb://127.0.0.1:27017"

router.get('/', (req, res, next) => {
    MongoClient.connect(murl, (err, client) => {
        ~async function getTest(params) {
            let ret = await client.db('questions').collections()
            Promise.all(ret.map(item =>
                item.find({}).toArray()
            )).then(ret => {
                res.send(ret)
                client.close()
            })
        }()
    })
})

module.exports = router