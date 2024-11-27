//middleware da aggiungere tra gli argomenti di ogni endpoint che vogliamo proteggere
const jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// middleware da aggiungere agli endpoint che sono accessibili solo dall'admin
function verifyAdmin(req,res,next){
    if(req.user.role !== 'admin'){
        return res.status(403).json({message: 'Accesso riservato agli admin'});
    }
    next();
} 

module.exports = { authenticateToken, verifyAdmin }