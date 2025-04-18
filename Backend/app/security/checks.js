const Activity = require('../model/activity');
const Participation = require('../model/participation');
const Report = require('../model/report');
const mongoose = require('mongoose')
const {Types: {ObjectId}} = mongoose;

async function userJoined(userId, activityId){
    var alreadyJoinedActivity = await Participation.find({activityId : activityId, userId : userId}).lean()
    if (alreadyJoinedActivity.length > 0) {
        return true
    }
    return false
}

async function userReported(userId, activityId){
    var alreadyReportedActivity = await Report.find({activityId : activityId, userId : userId}).lean()
    if (alreadyReportedActivity != undefined && alreadyReportedActivity.length > 0) {
        return true
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