const express = require('express');
const router = express.Router();
const cp = require('child_process')
const url = require('url')

router.get('/', (req, res, next) => {
    var params = url.parse(req.url, true).query
    cp.exec(`python test_py.py ${params.money1} ${params.money2}`, (err, stdout, stderr) => {
        if (err) console.log('stderr', err);
        if (stdout) {
            res.send(JSON.parse(stdout))
        }
    });
})

module.exports = router;