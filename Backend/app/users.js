const express= require('express');
const {authenticateToken} = require('./security/verification');
const {verifyAdmin} = require('./security/verification');
const User = require('./model/user');
const router = express.Router();

router.use((req, res, next) => {
    console.log(`Routing to /users${req.url}`);
    next();
});

//promuove un utente normale a ruolo di admin
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

//restituisce all'admin tutti gli user (admin esclusi) presenti nel sistema.
router.get('/all', authenticateToken, verifyAdmin, async (req, res) => {
  try {
      const users = await User.find({ role : {$ne: 'admin'}}).select('-password');
      res.status(200).json({ users });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Errore durante il recupero degli utenti', error: err.message });
  }
});

//restituisce all'admin solo gli user (admin esclusi) con username corrispondente alla stringa di ricerca
router.get('/search/:query',authenticateToken, verifyAdmin, async (req, res) => {
  try {
      const query = req.params.query;
      const users = await User.find({
          role : {$ne: 'admin'},
          username: { $regex: query, $options: 'i' }, 
      }).select('-password');
      
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: 'Errore interno del server' });
  }
});

//restituisce i dati privati dell'utente eccetto la sua password
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

//aggiorna campo email o username del profilo
router.put('/private', authenticateToken, async (req, res) => {
    const {username, email} = req.body;

    if (!username && !email) {
      return res.status(400).json({ error: 'Nessun campo da modificare specificato' });
    }
  
    try {
      const userId = req.user.id;
      const updateFields = {};
      if (username) {
        updateFields.username = username;
      }
      if (email) {
        updateFields.email = email;
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'Utente non trovato.' });
      }
  
      res.status(200).json({ message: 'Profilo aggiornato con successo.', user: updatedUser });
    } catch (error) {
    //errore di unicità : username e email devono essere unici
    //https://www.mongodb.com/community/forums/t/e11000-duplicate-key-error-collection/14141
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Username o email già in uso.' });
      }
      console.error(error);
      res.status(500).json({ error:'Errore interno del server.' });
    }
  });

module.exports = router;