const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'backend', ts: Date.now() });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = { app };
