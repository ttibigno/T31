const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const router = express.Router();
const salt = require("../security/salt")
const Admin = require('../model/admin');

router.post('/register', async(req,res)=>{
   const{name, surname, email, username, password} = req.body;
   if (!name || !surname ||!email || !username || !password) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori!' });
    }
    try {
        const newUser = new User({ name, surname, email, username, password: await salt(password) });
        await newUser.save();
        res.status(201).json({ message: `Utente registrato con successo`, success: true });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Nome utente o email già in uso', success: false});
        }
        res.status(500).json({ message: 'Errore durante la registrazione', error: err, success: false });
    }
});

router.post('/login', async(req,res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message:'Credenziali non valide' });
        }

        // Controlla se l'utente è un admin
        const isAdmin = await Admin.findOne({ userId: user._id });

        const token = jwt.sign({ id: user._id, username: user.username}, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1h' });
        res.status(200).json({ accessToken: token,
            isAdmin: isAdmin ? true : false
         });

    } catch (err) {
        res.status(500).json({ message:'Errore durante il login', error: err });
        throw(err);
    }
});

module.exports = router;
