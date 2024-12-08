const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

// DB connection
const connect = require('./server/database/connection');
connect();

// App setup
app.use(cookieParser());
app.use(morgan('combined'));
app.set('view engine', 'hbs');

// Public routes
app.use('/css', express.static(path.resolve(__dirname, "public/css")));
app.use('/js', express.static(path.resolve(__dirname, "public/js")));

// Router
const router = require('./server/router/router');
app.use(router);

const PORT = process.env.PORT || 1414;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));