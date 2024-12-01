const express= require('express');
const {authenticateToken} = require('./security/verification');
const {verifyAdmin} = require('./security/verification');
const User = require('./model/user');
const router = express.Router();

router.use((req, res, next) => {
    console.log(`Routing to /users${req.url}`);
    next();
});

router.put('/promote/:id', authenticateToken, verifyAdmin, async(req,res) =>{

    const userId= req.params.id;
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'Utente non trovato'});
        }

        if(user.role==='admin'){
            return res.status(400).json({message: 'Questo utente è già admin'});
        }
//https://mongoosejs.com/docs/tutorials/findoneandupdate.html
        await User.findByIdAndUpdate(
            userId,
            {role:'admin'},
            {new: true, runValidators: false } 
        );

        res.status(200).json({ message: 'Utente promosso ad admin'});

    } catch(err){
        res.status(500).json({message: 'Errore durante la Promozione', error: err});
    }
});

router.get('/private', authenticateToken, async(req, res) =>{
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message: 'Utente non trovato'});
        }
        res.status(200).json(user);
    } catch(error){
        res.status(500).json({message: 'Errore durante il recupero dei dati utente', error});
    }
});


module.exports = router;