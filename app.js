require('dotenv').config({"path": "./config/config.env"});
const express = require('express');
const http = require('http')
const cookiParser = require('cookie-parser');
const cloudinary = require("cloudinary")
const cors = require("cors")
const socketIo = require('socket.io')

const app = express();
const server = http.createServer(app)
// app.use(cors())
const io = socketIo(server)
const MsgModel = require('./model/Msg')
const {sendPushNotification} = require('./config/notification')


const {connectDataBase} = require('./db/conn');
connectDataBase();
app.use(cookiParser());

//--------------- middleware--------------
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true}));

app.use(cors())

//---------------import router ----------
const user = require('./routes/user');
const post = require('./routes/post');
const msg = require('./routes/msg');
const cloud_message = require('./routes/cloud-message')


//---------------use router -------------
app.use('/api/v1', user);
app.use('/api/v1', post);
app.use('/api/v1', msg);
app.use('/api/v1', cloud_message);

cloudinary.config({
    cloud_name: process.env.COLUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

global.onlineUsers = new Map();
global.appOnlineUser = new Map();

io.on('connection', (socket)=>{
    global.chatSocket = socket;

    socket.on('online-user', ({selfId})=>{
        // onlineUsers.set(to, socket.id)
        appOnlineUser.set(socket.id, selfId)
        sendPushNotification("63f269d263a2393b6cdac1c7", "63f268ef63a2393b6cdac198", "data.message.text")
    })

    socket.on('chat-online-user', async({selfId, to})=>{
        onlineUsers.set(selfId, socket.id)
        const lastMsg = await MsgModel.findOne({
            users: {
                $all: [selfId.toString(), to.toString()]
            }
        }).sort({updatedAt: -1})



        if(lastMsg.sender.toString() !== selfId){

            lastMsg.seen = true;
            await lastMsg.save();

            const user = onlineUsers.get(to);
            if(user !== undefined){
                socket.to(user).emit('last-msg-seen', {seen: true})
            }
        }

    })
   
    socket.on('send-msg', async({data, from,  to})=>{
        const toSocketId = onlineUsers.get(to)
        if(toSocketId !== undefined){

            socket.to(toSocketId).emit('res-msg', data)

            const selfSocketId = onlineUsers.get(from)

            const userToLstMsg = await MsgModel.findOne({
                users: {
                    $all: [from.toString(), to.toString()]
                }
            }).sort({updatedAt: -1})
            userToLstMsg.seen = true;
            await userToLstMsg.save();
            socket.emit('live-chat-seen', {seen: true})

        } else {
            // ============== push notification ========
            socket.emit('live-chat-seen', {seen: false})
            console.log("notification")
            sendPushNotification(from, to, data.message.text)
        }
    })

    socket.on('live-chat-off', ({selfId})=>{
        onlineUsers.delete(selfId)
    })


    socket.on("disconnect", (data) => {
        const toId = appOnlineUser.get(socket.id)
        onlineUsers.delete(toId)
        appOnlineUser.delete(socket.id)
      });
})


server.listen(process.env.PORT, ()=>{
    console.log(`App listen on port ${process.env.PORT}`);
})

