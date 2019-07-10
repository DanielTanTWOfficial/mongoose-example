var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    localStrategy           = require("passport-local"),
    User                    = require("./models/user");
    Product                 = require("./models/product")
    
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://sellers:olzyu0cGsZuhmNGv@anti-food-wastage-yckoc.mongodb.net/testauth?retryWrites=true&w=majority", {useNewUrlParser: true});

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// express-session must come before passport
app.use(require("express-session")({
    secret: "the345train2 is coming in hot",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ======================================================================
// ROUTES

app.get('/', function(req, res) {
   res.render('home'); 
});

app.get('/register', function(req, res) {
   res.render('register'); 
});

app.post('/register', function(req, res) {
    // Password is stored as hashed and salted version, not together with username
    User.register(new User({username: req.body.username, email: req.body.email, storename: req.body.storename, address: req.body.address}), req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function() {
           res.redirect('/secret'); 
        });
    });
});

app.get('/addprod', isLoggedIn, function(req, res) {
    res.render('addproduct');
});

app.post('/addprod', isLoggedIn, function(req, res) {
    Product.create({name: req.body.product, price: req.body.price, quantity: req.body.quantity, store_id: req.user['_id']}, function(err, product) {
        if(err) {
            console.log(err);
            return res.render('secret');
        }
        res.redirect('/secret');
    });
});

app.get('/secret', isLoggedIn, function(req, res) {
   res.render('secret'); 
});

// LOGIN ROUTES
app.get('/login', function(req, res) {
    res.render('login');
});

// login logic + middleware
app.post('/login', passport.authenticate("local", {
    // on successful login
    successRedirect: '/secret',
    // on invalid credentials
    failureRedirect: '/login'
}), function(req, res) {
    
});

// LOGOUT ROUTES
app.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/');
});

// Check if user is logged in, then redirect to next page, otherwise redirect
function isLoggedIn(req, res, next) {
   if(req.isAuthenticated()) {
       console.log(req.user);
       return next();
   } 
   console.log('not logged in');
   res.redirect('/login');
}

app.listen(3000, function(){
   console.log("Server Started"); 
});