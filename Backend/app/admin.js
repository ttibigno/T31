const express = require('express');
const router = express.Router();
const Activity = require('./model/activity');
const User = require('./model/user');
const Admin= require('./model/admin');
const {isIDValid} = require('./security/checks');
const {authenticateToken} = require('./security/verification');
const {verifyAdmin} = require('./security/verification');

router.use((req, res, next) => {
    authenticateToken(req, res, () => {
        verifyAdmin(req, res, next);
    });
});
//Restituisce all'admin le attività con più segnalazioni
//https://www.mongodb.com/community/forums/t/sorting-with-mongoose-and-mongodb/122573
//https://mongoosejs.com/docs/tutorials/lean.html
router.get('/manageActivities', async(req,res) => {
    try{
        let reportedActivities= await Activity.find({ warnings: { $gte: 1 }})
        .sort({warnings:-1});

        if(reportedActivities.length === 0) {
            return res.status(205).json({message: 'Nessuna attività con segnalazioni'});
        }
        res.status(200).json(reportedActivities);
    } catch (error){
        res.status(500).json({message: 'Errore nel monitoraggio delle segnalazioni', error});
    }
});

//rimuovi un'attività (per operatore comunale)
router.delete('/manageActivities/:id', async (req, res) =>{
    const activityId = req.params.id;
    if (await isIDValid(activityId)){

    try{
        const deletedActivity = await Activity.findByIdAndDelete(activityId);
        if (!deletedActivity) {
            return res.status(404).json({ message: 'Attività non trovata' });
        }
        res.status(200).json({ message: 'Attività eliminata con successo' });
    }  catch(error){
        res.status(500).json({message: 'Errore durante eliminazione attività'});
    }
    }
    else {
        res.status(400);
        res.end();
    }
});

//promuove un utente normale a ruolo di admin
router.put('/manageUsers/:id', async(req,res) =>{
    const userId= req.params.id;
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'Utente non trovato'});
        }

       const existingAdmin = await Admin.findOne({userId:userId});
       if(existingAdmin){
           return res.status(400).json({message: 'Questo utente è già admin'});
       }
//https://mongoosejs.com/docs/tutorials/findoneandupdate.html
        const NewAdmin = new Admin ({userId: userId});
        await NewAdmin.save();

        res.status(200).json({ message: 'Utente promosso ad admin'});

    } catch(err){
        console.error(err);
        res.status(500).json({message: 'Errore durante la Promozione', error: err});
    }
});

//eliminare qualsiasi utente non admin
router.delete('/manageUsers/:id', async(req,res) =>{
    const userId= req.params.id;
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'Utente non trovato'});
        }
        const admin= Admin.findOne({userId});
        if(admin){
            return res.status(400).json({message: 'Non puoi eliminare un admin'});
        }
        await user.remove();
        res.status(200).json({ message: 'Utente eliminato con successo'});
    } catch(err){
        res.status(500).json({message: 'Errore durante la cancellazione', error: err});
    }});


//restituisce all'admin tutti gli user (admin esclusi) presenti nel sistema.
router.get('/manageUsers', async (req, res) => {
  try {
        const admins= await Admin.find().select('userId').lean();
        const userIds= admins.map(admin => admin.userId);
        const users = await User.find({_id: {$nin: userIds}}).select('-password').lean();
        res.status(200).json({ users });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Errore durante il recupero degli utenti', error: err.message });
  }
});

//restituisce all'admin solo gli user (admin esclusi) con username corrispondente alla stringa di ricerca
router.get('/manageUsers/:query', async (req, res) => {
  try {
      const query = req.params.query;
      const admins= await Admin.find().select('userId').lean();
      const userIds= admins.map(admin => admin.userId);
      const users = await User.find({
          _id: {$nin: userIds},
          username: { $regex: query, $options: 'i' }, 
      }).select('-password').lean();
      
      res.status(200).json(users);
  } catch (error) {
    console.log(error);
      res.status(500).json({ error: 'Errore interno del server' });
  }
});

module.exports = router;