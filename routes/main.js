var router = require('express').Router();

router.get('/', function(req, res){
	res.render('main/home');
});

router.get('/signup', function(req, res){
	res.render('accounts/signup')
})
module.exports = router;