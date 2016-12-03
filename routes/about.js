var router = require('express').Router();

router.get('/about', function(req, res){
	res.render('main/about');
});

module.exports = router;