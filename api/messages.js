const express = require('express');
const mongoose = require('mongoose');
const conf = require('../config');
const userModel = require('./users').userModel;

const router = express.Router();

router.use(express.json())

mongoose.connect(conf.db)
.then(()=> console.log("connected to db:)"))
.catch(()=> console.log("couldn't connect to db:("))

const Message = new mongoose.Schema({
    chat:mongoose.Schema.Types.ObjectId,
    sender:mongoose.Schema.Types.ObjectId,
    datetime:Date,
    reply:mongoose.Schema.Types.ObjectId,
    content:String,
    isSeen:Boolean
});
const messageModel = mongoose.model("Message", Message);

router.get("/messages/:id", async(req, res) => {
        try{
            let requester = await userModel.findOne({username:req.query["username"], password:req.query["password"]});
            if(requester){
                let message = await messageModel.findOne({_id:req.params["id"]}, {_id:0});
                res.status(200).json(message.toJSON());
            }
            else{
                res.sendStatus(403);
            }
        }
        catch{
            res.sendStatus(404)
        }
    })
router.post("/messages", async(req, res) => {
        try{
            
        }
        catch(e){
            res.sendStatus(400);
        }
    })

module.exports = router;