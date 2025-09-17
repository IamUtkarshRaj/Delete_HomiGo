const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require("./config/dbconnection");
const cors = require("cors");
const fileUpload = require('express-fileupload');

require("dotenv").config();
connectDB();



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const roomsRouter = require('./routes/rooms');
const ownerRouter = require('./routes/owner');


var app = express();

// CORS configuration must come before other middleware
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(null, false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Enable pre-flight for all routes
app.options('*', cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));

// Apply routes
app.use('/', indexRouter);
app.use('/api', usersRouter); // This will make auth routes available at /api/auth/*
app.use('/api/rooms', roomsRouter);
app.use('/api/owner', ownerRouter);

module.exports = app;
