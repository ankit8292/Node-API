const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const authUserRoutes = require('./api/routes/authUsers');

mongoose.connect("mongodb+srv://Aditya:BIKRAMGANJ1@portfolio-android-d7dwf.mongodb.net/test?retryWrites=true&w=majority",{
   
    useUnifiedTopology: true,
    useNewUrlParser: true
});

mongoose.Promise = global.Promise;

//this dependency is for displaying which request is called
app.use(morgan('dev'));
app.use('/uploads',express.static("uploads"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//cors  (CROSS ORIGIN RESOURCE SHARE) used for validating which sites/headers are allowed from this middleware
app.use((req,res,next) =>{

    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,DELETE,PATCH,GET')
        return res.status(200).json({

        });
    }
    next();
});

app.use('/users',userRoutes);
app.use('/authusers',authUserRoutes);


//error management
app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
   res.status(error.status || 500);
   res.json({

      error:{
          message:error.message
      }

   });
});

module.exports = app;