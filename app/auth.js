const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./model/user');
const router = express.Router();



// ONLY FOR DEVELOPMENT REMOVE LATER
router.get('', async (req, res) => {
    let users = await User.find({}).lean()
    users = users.map( (user) => {
        return {
            id: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            password: user.password
        }
    })
    res.status(200).json(users);
})


router.post('/register', async(req,res)=>{
   const{name, surname, email, username, password, adminSecret} = req.body;
   if (!name || !surname ||!email || !username || !password) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori!' });
    }
    try {
        let role= 'user';
        if(adminSecret){
            if(adminSecret === process.env.ADMIN_SECRET){
                role='admin';
            } 
            else{
                return res.status(403).json({ message: 'Token admin non valido'});
            }
        }
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, surname, email, username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: `Utente registrato come ${role}` });
    } catch (err) {
        res.status(500).json({ message: 'Errore durante la registrazione', error: err });
    }
});

router.post('/login', async(req,res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(403).json({ message:'Credenziali non valide' });
        }

        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1h' });
        res.json({ accessToken: token });
    } catch (err) {
        res.status(500).json({ message:'Errore durante il login', error: err });
    }
});

//middleware da aggiungere tra gli argomenti di ogni endpoint che vogliamo proteggere
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

module.exports = { router, authenticateToken, verifyAdmin };