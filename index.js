const express = require('express');
const cors = require('cors');

const userRouter = require('./api/users').router;
const chatRouter = require('./api/chats').router;

const userModel = require('./api/users').userModel;
const chatModel = require('./api/chats').chatModel;
const messageModel = require('./api/messages').messageModel;

const app = express();
var expressWs = require('express-ws')(app);

app.use(cors());

app.use("/", userRouter);
app.use("/", chatRouter);

//web socket api s:

let clients = [];

function findClient(user){
    let i;
    for(i = 0; i < clients.length; i++){
        if(clients[i].user === user)
            break;
    }
    if(i === clients.length)
        return -1;
    else
        return i;
}

expressWs.getWss().on('connection', async (ws, req)=> {
    //handle on connection:
    let requester = await userModel.findOne({username : req.query["username"], password: req.query["password"]});
    if(requester){
        requester = null;
        clients.push(
            {
                socket:ws,
                user:req.query['user']
            }
        )
    }
    else ws.close()
    
    
})
app.ws("/chat", (ws, req) => {
    
    ws.on('message', async (message)=>{
        let chatMessage = JSON.parse(message);
        let chat = await chatModel.findById(req.query['chat']);
        //send out the message:
        if(chat.user1 === chatMessage.sender){
            let index = findClient(chat.user2);
            if(index >= 0){
                chatMessage.datetime = new Date()
                await messageModel.create(chatMessage);
                let sender = await userModel.findById(chatMessage.sender, {password:0, email:0, chats:0})
                chatMessage.sender = JSON.stringify(sender);
                clients[index].socket.send(JSON.stringify(chatMessage))
            }
        }
        else{
            let index = findClient(chat.user1);
            if(index >= 0){
                chatMessage.datetime = new Date();
                await messageModel.create(chatMessage);
                let sender = await userModel.findById(chatMessage.sender, {password:0, email:0, chats:0})
                chatMessage.sender = JSON.stringify(sender);
                clients[index].socket.send(JSON.stringify(chatMessage))
            }
        }          

    })
    ws.on('close', ()=> {
        let index = findClient(req.query['user']);
        if(index >= 0){
            clients.splice(index, index+1);
        }
    })
})

app.listen(8000);
console.info("server started on port 8000:)");