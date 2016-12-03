var express = require('express'); //you need a web server first
var morgan = require('morgan');
var ejs = require('ejs');//for the views
var engine = require('ejs-mate');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session'); //helps manage sessions and saves it in the memory
var cookieParser = require('cookie-parser'); //helps save the session encrypted id into the client
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var config= require('./config/secret');
var passport = require('passport');


//connect db
mongoose.connect(config.database, function(err){
	if(err){
		console.log('failed connecting to databse');
	}else{
		console.log('database connection establish succesffuly')
	}
})

//execute
var app = express(); //create an object of it express

//middleware
app.use(morgan('dev'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));//used to addn
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	resave:true,//garantee that the session is saved
	saveUninitialized: true, //
	secret: config.secretKey, //securing the session: true
	store: new MongoStore({url:config.database, autoReconnect: true})
})); 
app.use(function(req, res, next){
	res.locals.user = req.user; //NB
	next();
})
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//you create routes
var mainRoutes = require('./routes/main');
var aboutRoutes = require('./routes/about');
var userRoutes = require('./routes/user');
app.use(mainRoutes);
app.use(aboutRoutes);
app.use(userRoutes);

//kick off the application using by using the listen
app.listen(config.port, function(){
	console.log('app running on port 3000');
});