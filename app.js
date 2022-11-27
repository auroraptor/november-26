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
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { logNow, logError } = require('./utils/log');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(helmet());

/**
 * пишу конфиг здесь ради удобства чтения
 */
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(cors());

const { DB = 'mongodb://localhost:27017/todolistdb', PORT = 3017 } = process.env;

mongoose.connect(DB, { autoIndex: true })
  .then(() => logNow('Connected to database'))
  .catch((err) => logError(err));

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  logNow(`CORS-enabled app server listening on port ${PORT}`);
});
