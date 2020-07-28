const dotenv = require("dotenv");

const mongoose = require("mongoose");
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();

dotenv.config();
//Connect to Mongo
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const dbString = process.env.DATABASE
// //DB Connection
// mongoose
//   .connect(dbString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   })
//   .then(() => {
//     console.log("DB CONNECTED");
//   });

// //Middlewares
// app.use(bodyParser.json());
// app.use(cors());


// //PORT
// const port = process.env.PORT || 8000;

//Starting a server
app.listen(PORT, console.log(`app is running at ${PORT}`));
