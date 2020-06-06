const mongoose = require("mongoose");
const express = require('express')
const session = require('express-session')
const User = require("./UserModel");
const Card = require("./CardModel");
const Trade = require("./TradeModel");
var path = require('path');
var hbs = require('express-handlebars');
//require module, pass it the session module
const MongoDBStore = require('connect-mongodb-session')(session);
//Create the new mongo store, using the database we have been
// using already, and the collection sessiondata
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/a5',
  collection: 'sessiondata'
});

const app = express()
// Use the session middleware
//Set the store property in the options
app.use(session({ secret: 'some secret here', store: store }))


let db;
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

let userRouter = require("./user-router");
app.use("/users", userRouter);
let cardRouter = require("./card-router");
app.use("/card", cardRouter);
let tradeRouter = require("./trade-router");
app.use("/tradecard", tradeRouter);

let radomcard = new Array();
app.get('/', function(req, res) {
	res.render('login');
	randomucards();
	//console.log(radomcard);
});

app.post("/login", login);
app.post('/register',register)
app.get("/logout", logout);

//get random card
function randomucards() {
	radomcard=[];
	mongoose.connection.db.collection("cards").find({}).toArray(function (err, result) {
		let cards = result;
		for (let x = 0; x < 10; x++) {
		   var random = Math.floor(Math.random() * cards.length);
			radomcard.push(cards[random]);
		}
		console.log(radomcard);
	})
}
 
//authorization
function auth(req, res, next) {
	if(!req.session.loggedin){
		res.status(401).send("Unauthorized");
		return;
	}
	
	next();
};

//register function
function register(req, res, next){
	console.log(req.body);
    if(req.session.loggedin){
		res.status(200).send("Already logged in. Please Logout");
		return;
	}
	let newuser = new User();
    newuser.name = req.body.username;
	newuser.password = req.body.password;
	newuser.cards = radomcard;
	newuser.friends = [];
	newuser.pendingfriends = [];
	newuser.trade = [];
    User.find({ name: req.body.username })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "user exists"
        });
      } else {
        db.collection("users").insert(newuser);
        return res.status(200).json({
            message: "user created"
          });
      }
    });
}

//login function
//If the username and password match somebody in our database,
// then create a new session ID and save it in the database.
//That session ID will be associated with the requesting user
function login(req, res, next){
	if(req.session.loggedin){
		res.status(200).send("Already logged in.");
		return;
	}
	console.log(req.body);
	let username = req.body.username;
	let password = req.body.password;
	User.findOne({name: username}, function(err, result){
		if(err)throw err;
		
		console.log(result);
		
		if(result){
			if(result.password === password){
				req.session.loggedin = true;
				req.session.username = username;
				req.session._id = result._id;
				//res.status(200).send("Logged in");
				res.redirect('/users/'+result._id);
			}else{
				res.status(401).send("Not authorized. Invalid password.");
			}
		}else{
			res.status(401).send("Not authorized. Invalid username.");
			return;
		}
		
	});
}

//logout function
function logout(req, res, next){
	if(req.session.loggedin){
		req.session.loggedin = false;
		res.status(200).redirect('/')
	}else{
		res.status(200).send("You cannot log out because you aren't logged in.");
	}
}


mongoose.connect('mongodb://localhost:27017/a5', {useNewUrlParser: true});
//Get the database
db = mongoose.connection;
	
app.listen(3000);
console.log("Server listening on port 3000");
