require('dotenv').config();
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');


const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT|| 3001;
const mongoose = require('mongoose');
const settings = require('./app/config/DB');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session);
const passport = require('passport');
// var app = express();

// Database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL);
const connection = mongoose.connection;
mongoose.connection
    .once('open', function () {
      console.log('MongoDB running');
    })
    .on('error', function (err) {
      console.log(err);
    });



// Session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
 })



            
// Session config
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  store: mongoStore,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))

// passport congif
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize())
app.use(passport.session())


// app.use(bodyParser.json());
// app.use(cors());
app.use(flash());
// front end direction
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}))

app.use(express.json());

// Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session
  res.locals.user = req.user
  next()

})



// set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))

app.set('view engine', 'ejs')
require('./routes/web')(app)
app.use((req, res) => {
    res.status(404).render('errors/404')
})



app.listen(PORT, () =>{
    console.log(`listening on port ${PORT}`);
});