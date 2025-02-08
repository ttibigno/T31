const Activity = require('../model/activity');
const mongoose = require('mongoose')
const {Types: {ObjectId}} = mongoose;

async function userJoined(userId, activityId){
    var activity = await Activity.findById(activityId)
    if (activity != undefined && activity.joinedUserIds.length > 0) {
        if (await activity.joinedUserIds.includes(userId)) return true
    }
    return false
}

async function userReported(userId, activityId){
    var activity = await Activity.findById(activityId)
    if (activity != undefined && activity.reportUserIds.length > 0) {
        if (await activity.reportUserIds.includes(userId)) return true
    }
    return false
}

async function isIDValid(anyId){
    return (ObjectId.isValid(anyId) && (new ObjectId(anyId)).toString() === anyId )
}

async function checkTime(activityId){
    var activity = await Activity.findById(activityId)
    if (activity != undefined) {
        var time = new Date(); //tempo attuale
        if (activity.date.getTime() < time.getTime()) return true
    }
}
module.exports = {userJoined, userReported, isIDValid, checkTime}