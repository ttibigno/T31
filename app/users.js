const express= require('express');
const {authenticateToken} = require('./auth');
const {verifyAdmin} = require('./auth');
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




module.exports = router;