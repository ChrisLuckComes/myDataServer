var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    delete req.session.user
    req.session.destroy()
    res.end()
})

module.exports = router
