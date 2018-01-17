var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    console.log(req.session.id)
    if (req.session.user) {
        res.send(true)
    } else {
        res.send(false)
    }
})

module.exports = router
