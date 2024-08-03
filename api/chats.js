const express = require('express');
const mongoose = require('mongoose');
const conf = require('../config');
const userModel = require('./users').userModel;
const messageModel = require('./messages').messageModel;

const router = express.Router();

router.use(express.json())

mongoose.connect(conf.db)
.then(()=> console.log("connected to db:)"))
.catch(()=> console.log("couldn't connect to db:("))

const Chat = new mongoose.Schema({
    user1: String,
    user2: String,
    user1IsBlocked:Boolean,
    user2IsBlocked:Boolean,
    messages:[String]
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
            res.sendStatus(500)
        }
    })
router.route("/chats")
    .get(async(req, res) => {
        try{
            let requester = await userModel.findOne({username:req.query["username"], password:req.query["password"]});
            if(requester){
                let chats = await chatModel.find({_id : {$in:requester.chats}});
                const userProjection = {password:0, email:0, chats:0};
                for(let i = 0; i < chats.length; i++){
                    let user1= await userModel.findById(chats[i].user1, userProjection);
                    let user2 = await userModel.findById(chats[i].user2, userProjection);
                    let messages = await messageModel.find({_id:{$in: chats[i].messages}});
                    for(let j = 0; j < messages.length; j++){
                        let sender = await userModel.findById(messages[j].sender, userProjection); 
                        messages[j].sender = JSON.stringify(sender)
                    }     
                    chats[i].user1 = JSON.stringify(user1);
                    chats[i].user2 = JSON.stringify(user2);
                    chats[i].messages = JSON.stringify(messages);
                }     
                res.json(chats);
            }
        }
        catch(err){
            res.sendStatus(500)
        }
    })
    .post(async(req, res) => {
        try{
            
        }
        catch(e){
            res.sendStatus(500);
        }
    })

router.post("/messages", async(req, res) => {
    try{
        const requester = await userModel.findOne({username:req.query["username"], password:req.query["password"]});
        if(requester){
            console.log(req.body)
            req.body.datetime = new Date();
            let result = await messageModel.create(req.body);
            let messageId = result._id.toString()
            let relatedChat = await chatModel.findById(req.body.chat);
            relatedChat.messages.push(messageId)
            await relatedChat.save();
            res.sendStatus(200)
        }
        else
            res.sendStatus(404);
    }
    catch(e){
        console.log(e)
        res.sendStatus(500);
    }
})

module.exports = {router, chatModel};