const express = require('express');
const router = express.Router();
const Activity = require('./model/activity');
const {isIDValid, userReported} = require('./security/checks');
const {authenticateToken} = require('./security/verification');

// segnala un'attività
router.put('/:id', authenticateToken, async( req, res) => {
    const userId = req.user.id;
    const activityId = req.params.id;
    if (await isIDValid(userId)){
        if(await userReported(req.user.id, req.params.id)) {
            res.status(401);
            res.end();
        }
        else {
            try{
                const updatedActivity = await Activity.findByIdAndUpdate(
                    activityId,
                    { $inc: { warnings: 1 } },
                    {new : true}
                );
                await Activity.findByIdAndUpdate(
                    activityId,
                    { $push : {reportUserIds : userId}},
                    {new: true, runValidators: false } 
                )
        
                if(!updatedActivity){
                    return res.status(404).json({message: 'Attività non trovata'});
                }
                res.status(200).json({
                    message: 'Segnalazione aggiunta con successo',
                    warnings: updatedActivity.reportCount
                });
            }  catch(error) {
                res.status(500).json({message :'Errore durante la segnalazione'});
            }
        }
    }
});

module.exports = router;