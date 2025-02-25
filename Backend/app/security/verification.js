//middleware da aggiungere tra gli argomenti di ogni endpoint che vogliamo proteggere
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');

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
async function verifyAdmin(req,res,next){
    try{
        console.log(req.user.id);
        const isAdmin= await Admin.findOne({userId: req.user.id});
        if(!isAdmin) {
            return res.status(403).json({message: 'Non sei autorizzato ad accedere a questa risorsa'});
        }
        next();
    } catch (error){
        res.status(500).json({message: 'Errore durante la verifica del ruolo di amministratore', error});
    }

} 

module.exports = { authenticateToken, verifyAdmin }