/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes');
const HttpStatusCode = require('./utils/HttpStatusCode');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(cors());

const { DB = 'mongodb://localhost:27017/todolistdb', PORT = 3017 } = process.env;

mongoose.connect(DB, { autoIndex: true })
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(err));

app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = HttpStatusCode.INTERNAL_SERVER, message } = err;

  res.status(statusCode).send({
    message: statusCode === HttpStatusCode.INTERNAL_SERVER
      ? 'Внутренняя ошибка сервера' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`CORS-enabled app listening on port ${PORT}`);
});
