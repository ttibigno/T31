const Activity = require('../model/activity');

async function userJoined(userId, activityId){
    var activity = await Activity.findById(activityId)
    if (activity != undefined && activity.joinedUserIds.length > 0) {
        if (await activity.joinedUserIds.includes(userId)) return true
    }
    return false
}

module.exports = userJoined