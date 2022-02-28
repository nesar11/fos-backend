require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT|| 3004;
const mongoose = require('mongoose');
const settings = require('./app/config/DB');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session)
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


app.use(flash());
// front end direction
app.use(express.static('public'));




app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))

app.set('view engine', 'ejs');
require('./routes/web')(app)



app.listen(PORT, () =>{
    console.log(`listening on port ${PORT}`);
});