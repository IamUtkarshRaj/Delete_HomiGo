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
const listingRouter = require('./routes/listing');
const messagesRouter = require('./routes/messages');
const connectionsRouter = require('./routes/connections');


var app = express();

// CORS configuration must come before other middleware
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:5173'
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, origin); // Set Access-Control-Allow-Origin to the request's origin
    }
    return callback(new Error('Not allowed by CORS'));
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
app.use('/api/users', usersRouter); // This will make GET /api/users available
app.use('/api/rooms', roomsRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/listings', listingRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/connections', connectionsRouter);

module.exports = app;
