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
const MongoDBStore = require('connect-mongodb-session')(session);

// var app = express();



// database connection
mongoose.Promise = global.Promise;
mongoose.connect(settings.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);


var store = new MongoDBStore({
  uri: process.env.MONGO_CONNECTION_UR,
  // uri: 'mongodb://localhost:27017/fos_db',
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});


app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));


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