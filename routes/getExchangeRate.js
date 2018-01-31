const express = require('express');
const router = express.Router();
const url = require('url')
const query = require('../pool')


router.get('/', (req, res, next) => {
    var params = url.parse(req.url, true).query
    var money1 = params.money1
    var money2 = params.money2
    var sql = `select currency,rate from ExchangeRate where currency in('${money1}','${money2}')`
    query(sql, null, (err, result, fields) => {
        if (err)
            throw err
        else
            res.send([result[0], result[1]])
    })
})

module.exports = router;
