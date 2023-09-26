const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(requestLogger);

app.use(errorLogger);
