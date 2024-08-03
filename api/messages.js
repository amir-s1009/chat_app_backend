const express = require('express');
const mongoose = require('mongoose');
const conf = require('../config');

mongoose.connect(conf.db)
.then(()=> console.log("connected to db:)"))
.catch(()=> console.log("couldn't connect to db:("))

const Message = new mongoose.Schema({
    chat:String,
    sender:String,
    datetime:Date,
    reply:String,
    content:String,
    isSeen:Boolean
});
const messageModel = mongoose.model("Message", Message);

module.exports = {messageModel};