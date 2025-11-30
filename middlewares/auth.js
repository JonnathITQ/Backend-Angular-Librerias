const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const headerToken = req.headers['authorization'];

    if (!headerToken) {
        return res.status(401).send({ message: 'Falta el token' });
    }

    const token = headerToken.split(" ")[1];

    try {
        const verificar = jwt.verify(token, "adriel");
        req.usuario = verificar;
        next();
    } catch (error) {
        return res.status(403).send({ message: "Token Inválido", error });
    }
};
