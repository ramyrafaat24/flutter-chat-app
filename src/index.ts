import express from 'express';
import {json} from 'body-parser';
import authRoutes from  './routes/authRoutes';
import conversationsRoutes from './routes/conversationsRoutes';
import messageRoutes from './routes/messageRoutes'
import http from 'http';
import{Server} from 'socket.io';
import { Socket } from 'dgram';
import { error } from 'console';
import { saveMessage } from './controllers/messageController';
import contactsRoutes from './routes/contactsRoutes';


const app = express();
const server = http.createServer(app);

app.use(json());
const io = new Server(server,{
    cors:{
        origin:'*'
    }
})
app.use('/auth', authRoutes);
app.use('/conversation', conversationsRoutes);
app.use('/message', messageRoutes);
app.use('/contacts', contactsRoutes);


io.on('connection',(socket)=>{
    console.log('A User conntected',socket.id);
    socket.on('joinConversation',(coversationId)=>{
        socket.join(coversationId);
        console.log('User joined conversation : '+coversationId);
    })
    socket.on('sendMessage',async(message)=>{
        const{conversationId, senderId,content} = message;
        try {
            const savedMessage = await saveMessage(conversationId,senderId, content);
            console.log("sendMessage : ");
            console.log(saveMessage);
            io.to(conversationId).emit('newMessage', savedMessage);
            io.emit('conversationUpdated',{
                conversationId,
                lastMessage:savedMessage.content,
                lastMessageTime:savedMessage.created_at,
            })
        } catch (err) {
            console.error('Failed to save message',error);
        }
    });
    socket.on('disconnect',()=>{
        console.log('User Disconnected',socket.id)
    })
})

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
 console.log(  `Server is Runing Mr Ramy on port ${PORT}`);


});