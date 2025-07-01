export const globalErrorHandler = (err, req, res, next)=>{
    //stack
    //message
    const stack = err?.stack
    const message = err?.message
    const statusCode = err?.statusCode ? err?.statusCode : 500
    res.status(statusCode).json({
        stack,
        message
    })
}

//404 handler -> page not found
export const notFound = (req, res, next)=>{
    const err = new Error(`Route ${req.originalUrl} not found`)
    next(err);
}

// next is used for a proper flow control and middleware chaining
// this will transfer the control to next middleware with the error message and the next middleware will be the globalError handler as specified in the app.js