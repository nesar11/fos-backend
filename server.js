const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT|| 3000;
const mongoose = require('mongoose');
const config = require('./app/config/DB');

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

// front end direction
app.use(express.static('public'));




app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))

app.set('view engine', 'ejs');
require('./routes/web')(app)



app.listen(PORT, () =>{
    console.log(`listening on port ${PORT}`);
});