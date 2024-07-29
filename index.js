const express = require('express');
const userRouter = require('./api/users').router;
const chatRouter = require('./api/chats');
const messageRouter = require('./api/messages');

const app = express();

app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/", messageRouter);

app.listen(3000);
console.info("server started on port 3000:)");