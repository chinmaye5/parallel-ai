module.exports = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};