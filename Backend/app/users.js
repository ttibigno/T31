const express= require('express');
const {authenticateToken} = require('./security/verification');
const User = require('./model/user');
const router = express.Router();
const Activity= require('./model/activity');
const {isIDValid} = require('./security/checks');

router.use((req, res, next) => {
    console.log(`Routing to /users${req.url}`);
    authenticateToken(req, res, next);
});

//restituisce le attività create dall'utente
router.get('/activities', async( req, res) => {
    const creator = req.user.username;
    try{
    let activities = await Activity.find({creator : creator}).sort({date: -1}).lean();
    if(activities.length === 0){
        return res.status(205).json({message: 'Ancora nessuna attività creata'});
    }
    res.status(200).json(activities);
} catch(error){
    res.status(500).json({message: 'Errore nella restituzione delle attività create'});
}
});

//Crea le proprie attività
router.post('/activities', async (req, res) => {
  const creator = req.user.username;
  try {
      const newActivity = new Activity({
          name: req.body.name,
          topic: req.body.topic,
          place: req.body.place,
          date: req.body.date,
          creator: creator,  //il creatore è per forza quello che fa la richiesta
          maxSlot: req.body.maxSlot,
          remainingSlots: req.body.maxSlot, //gli slot rimanenti sono i maxSlot
          contacts: req.body.contacts
      });
      const savedActivity = await newActivity.save();  //questo per aspettare che i dati si salvino sul database

      res.status(201).json({
          self: '/api/v1/activities/' + savedActivity.id,
          name: savedActivity.name,
          topic: savedActivity.topic,
          place: savedActivity.place,
          date: savedActivity.date,
          creator: savedActivity.creator,
          maxSlot: savedActivity.maxSlot,
          remainingSlots: savedActivity.remainingSlots,
          contacts: savedActivity.contacts
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Errore durante la creazione' });
  }
});

//modifica una delle attività create dall'utente
router.put('/activities/:id', async(req,res) => {
    const activityId = req.params.id;
    const updates = req.body;
    const user= req.user.username;
    try{
        //non si può modificare il nome del creatore.
        if (updates.creator) {
            delete updates.creator;
        }

        const updatedActivity= await Activity.findOneAndUpdate(
            {_id : activityId, creator:user },
            updates,
            {new :true, runValidators: true}
        );

        if(!updatedActivity){
            return res.status(404).json({error: 'Attività non trovata o modifica non autorizzata'});
        }
        res.status(200).json(updatedActivity);
    } catch(err){
        console.error(err);
        res.status(400).json({error: 'Errore durante aggiornamento'});
    }
});

//elimina una delle attività create dall'utente
router.delete('/activities/:id', authenticateToken, async (req, res) =>{
    const activityId = req.params.id;
    const user = req.user.username;
    if (await isIDValid(activityId)){
    try{
        const deletedActivity= await Activity.findOneAndDelete(
            {_id : activityId, creator: user },
        );

        if (!deletedActivity) {
            return res.status(404).json({ message: 'Attività non trovata o user non autorizzato' });
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

//restituisce i dati privati dell'utente eccetto la sua password
router.get('/private', async(req, res) =>{
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
router.put('/private', async (req, res) => {
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

//elimina l'utente e tutte le sue attività
  router.delete('/private', async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Tentativo di eliminazione dell'utente con ID:", userId);

        await Activity.deleteMany({ creator: userId });

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "Account eliminato con successo." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Errore durante l'eliminazione dell'account." });
    }
});


module.exports = router;