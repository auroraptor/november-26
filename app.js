require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
// const cors = require('./middlewares/cors');
const { logNow, logError } = require('./utils/log');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(helmet());
// app.use(cors);

mongoose.connect('mongodb://localhost:27017/todolistbd', { autoIndex: true })
  .then(() => logNow('Connected to the server'))
  .catch((err) => logError(err));

const { PORT = 3017 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(routes);

app.use(errorLogger);
app.use(errors());
// app.use(errorHandler);

app.listen(PORT, () => {
  logNow(`App server listening on port ${PORT}`);
});
