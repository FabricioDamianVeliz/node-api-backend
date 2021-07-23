const ERROR_HANDLERS = {
    CastError: res =>
        res.status(400).send({
            error: 'La identificación utilizada está mal formada'
        }),

    ValidationError: (res, {message}) => 
        res.status(409).send({
            error: message
        }),
    
    JsonWebTokenError: res =>
        res.status(401).json({
            error: 'usuario o contraseña inválidos'
        }),

    TokenExpiredError: res =>
        res.status(401).json({
            error: 'token expirado'
        }),
    
    defaultError: res =>
        res.status(500).end()
}

module.exports = (error, req, res, next) => {
    
    console.error(error.name);

    const handler =
        ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

    handler(res, error)
}