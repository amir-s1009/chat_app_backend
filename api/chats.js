const express = require('express');
const mongoose = require('mongoose');
const conf = require('../config');
const userModel = require('./users').userModel;

const router = express.Router();

router.use(express.json())

mongoose.connect(conf.db)
.then(()=> console.log("connected to db:)"))
.catch(()=> console.log("couldn't connect to db:("))

const Chat = new mongoose.Schema({
    user1: mongoose.Schema.Types.ObjectId,
    user2: mongoose.Schema.Types.ObjectId,
    user1IsBlocked:Boolean,
    user2IsBlocked:Boolean,
    meassages:[mongoose.Schema.Types.ObjectId]
});
const chatModel = mongoose.model("Chat", Chat);

router.get("/chats/:id", async(req, res) => {
        try{
            let requester = await userModel.findOne({username:req.query["username"], password:req.query["password"]});
            if(requester){
                let chat = await chatModel.findOne({_id:req.params["id"]}, {_id:0});
                res.status(200).json(chat.toJSON());
            }
            else{
                res.sendStatus(403);
            }
        }
        catch{
            res.sendStatus(404)
        }
    })
router.post("/chats", async(req, res) => {
        try{
            
        }
        catch(e){
            res.sendStatus(400);
        }
    })

module.exports = router;