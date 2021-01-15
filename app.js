const createError = require('http-errors');
const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const checkoutRouter = require('./routes/checkout');
const resultRouter = require('./routes/result');
const paymentMethodsRouter = require('./routes/api/paymentMethods');
const paymentsRouter = require('./routes/api/payments');
const paymentsDetailsRouter = require('./routes/api/paymentsDetails');
const returnUrlRouter = require('./routes/returnUrl');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/checkout', checkoutRouter);
app.use('/result', resultRouter);
app.use('/api/paymentMethods', paymentMethodsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/payments/details', paymentsDetailsRouter);
app.use('/returnUrl', returnUrlRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
