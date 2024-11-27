const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./model/user');
const router = express.Router();
const salt = require("./security/salt")


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
            password: user.password,
            regActivities: user.regActivities,
            role: user.role
        }
    })
    res.status(200).json(users);
})


router.post('/register', async(req,res)=>{
   const{name, surname, email, username, password} = req.body;
   if (!name || !surname ||!email || !username || !password) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori!' });
    }
    try {
        let role= 'user';
        const newUser = new User({ name, surname, email, username, password: await salt(password), role });
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

        const token = jwt.sign({ id: user._id, username: user.username, role: user.role}, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1h' });
        res.status(200).json({ accessToken: token });

    } catch (err) {
        res.status(500).json({ message:'Errore durante il login', error: err });
        throw(err);
    }
});

module.exports = router;
