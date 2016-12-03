var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConf = require('../config/passport');

//retreives the login page
router.get('/login', function(req,res){
	if(req.user) res.redirect('/');
	res.render('accounts/login', {message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/profile',
	failureRedirect: '/login',
	failureFlash: true
}));

router.get('/profile',function(req,res){
	User.findOne({_id:req.user._id}, function(err, user){
		if(err) return next(err);
		res.render('accounts/profile', {user: user});
	});
});

router.get('/users', function(req, res, next){
	//using to get data from the mongo db
	User.find({}, function(err, users){
		if(err) return next(err);
		res.json(users);
	})
})

router.get('/signup', function(req,res, next){
	res.render('accounts/signup', {message: req.flash('message')});
});

router.post('/signup', function(req, res, next){
	var user = new User();

	user.email = req.body.email;
	user.password = req.body.password;
	user.profile.name = req.body.name;
	user.profile.picture = user.gravatar();

//querying the db
	User.findOne({email: req.body.email}, function(err, exisitngUser){
		if(exisitngUser){
			req.flash('message','Account with that email address already exist');
			return res.redirect('/signup');
		}else{
			user.save(function(err, user){
				if(err) return next(err);
					//used to save the session and login user
					req.login(user, function(err){
						if(err) return next(err);
						res.redirect('profile');
				})
			});
		}
	});
});

router.get('/edit-profile', function(req, res, next){
	//res.render('accounts/edit-profile', {message: req.flash('success')});

	User.findOne({_id:req.user._id}, function(err, user){
		if(err) return next(err);
		res.render('accounts/edit-profile', {user: user, message: req.flash('success')});
	});
});

router.post('/edit-profile', function(req,res,next){
	User.findOne({_id: req.user._id}, function(err, user){
		if(err) return next(err);

		if(req.body.name) 
			user.profile.name = req.body.name;

		if(req.body.address)
			user.address = req.body.address;

		user.save(function(err){
			if(err) return next(err);

			req.flash('success', 'Profile updated');
			return res.redirect('/edit-profile');
		})
	})
})

router.get('/logout', function(req, res, next){
	req.logout();
	res.redirect('/');
	next();
})



//express flash used to flash failure of sign up and depends on cookie parter(client) and expression session (server) libraries
module.exports = router;