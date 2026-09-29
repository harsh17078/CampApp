export const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err.stack || err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    message = 'Duplicate field value entered. An account with this email already exists.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
