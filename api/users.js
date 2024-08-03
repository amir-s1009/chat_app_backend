const express = require('express');
const mongoose = require('mongoose');
const conf = require('../config')

const router = express.Router();

router.use(express.json())

mongoose.connect(conf.db)
.then(()=> console.log("connected to db:)"))
.catch(()=> console.log("couldn't connect to db:("))

const User = new mongoose.Schema({
    name: String,
    family: String,
    username: String,
    password: String,
    email: String,
    lastSeen: Date,
    profile: Buffer,
    chats:[String]
});
const userModel = mongoose.model("User", User);

router.route("/users")
    .get(async(req, res) => {
        try{
            let user = await userModel.findOne({username:req.query["username"], password:req.query["password"]}, {_id:0});
            res.status(200).json(user);
        }
        catch{
            res.sendStatus(404)
        }
    })
    .post(async(req, res) => {
        try{
            let user = await userModel.findOne({username:req.body.username});
            if(!user){
                userModel.create(req.body);
                res.sendStatus(201);
            }
            else{
                res.sendStatus(304);
            }
        }
        catch(e){
            res.sendStatus(400);
        }
    })

router.get('/users/:id', async(req, res)=>{
    try{
        let requester = await userModel.findOne({username:req.query['username'], password:req.query['password']});
        if(requester){
            let target = await userModel.findOne({_id:req.params["id"]}, {password:0, email:0, chats:0});
            res.status(200).json(target);
        }
        else{
            res.sendStatus(403);
        }
    }  
    catch{
        res.sendStatus(404);
    }
})

module.exports = {router, userModel};