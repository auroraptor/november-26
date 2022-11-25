const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes');
const limiter = require('./middlewares/limiter');
const { logNow, logError } = require('./utils/log');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(cors());

mongoose.connect('mongodb://localhost:27017/todolistdb', { autoIndex: true })
  .then(() => logNow('Connected to the server'))
  .catch((err) => logError(err));

const { PORT = 3017 } = process.env;

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  logNow(`CORS-enabled app server listening on port ${PORT}`);
});
