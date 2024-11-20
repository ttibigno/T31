const express= require('express');
const jwt= require('jsonwebtoken');
const bcrypt= require('bcrypt');
const User= require('./model/user');
const router= express.Router();


router.post('/register', async(req,res)=>{
   const{nome, cognome, email, username, password}= req.body;
   if (!nome || !cognome ||!email || !username || !password) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori!' });
    }
    try {
        const salt= await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ nome, cognome,email, username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Utente registrato' });
    } catch (err) {
        res.status(500).json({ message: 'Errore durante la registrazione', error: err });
    }

});

router.post('/login', async(req,res)=>{
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(403).json({ message:'Credenziali non valide' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.json({ accessToken: token });
    } catch (err) {
        res.status(500).json({ message:'Errore durante il login', error: err });
    }
});

//questo è un middleware da aggiungere tra gli argomenti di ogni endpoint che vogliamo proteggere
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
module.exports = { router, authenticateToken };