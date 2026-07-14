const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRouter = require('./router/auth.router');
const clientRouter = require('./router/client.router');
const projectRouter = require('./router/project.router');
const taskRouter = require('./router/task.router');
const timeLogRouter = require('./router/timeLog.router');
const invoiceRouter = require('./router/invoice.router');
const analyticsRouter = require('./router/analytics.router');
const AppError = require('./utils/AppError');

const app = express();

app.use(helmet());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Freelancer Management API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/timelogs', timeLogRouter);
app.use('/api/v1/invoices', invoiceRouter);
app.use('/api/v1/analytics', analyticsRouter);

app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error('ERROR 💥:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
});

module.exports = app;
