// necessary imports
require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const PORT = process.env.PORT || 5000;
const { createServer } = require("http");
const { Server } = require("socket.io");
const { connectToDb } = require('./config/db');
const { addmessage } = require('./controller/messageController');
const { Participant } = require("./models/participantModel");

// creating a new express application
const app = express();

// loading and parsing all the permitted frontend urls for cors
let allowedOrigins = [];
try {
    allowedOrigins = JSON.parse(process.env.FRONTEND_URLS);
} catch (error) {
    console.log("Error parsing the 'FRONTEND_URLS' variable stored in your .env file. Please make sure it is in this format: ", '["valid_url_1", "valid_url_2"]');
}

// adding routes and external configurations to the application
require('./config/config')(app, allowedOrigins);

// creating a new server using the express application to allow socket io also listen on the server
const httpServer = createServer(app);

// configuring a new socket io instance
const io = new Server(httpServer, {
    cors: {
        origin: Array.isArray(allowedOrigins) ? allowedOrigins : [],
    },
    methods: ["GET", "POST"]
})

// listening when a client connects to our socket instance
io.on("connection", (socket) => {
    console.log("connected with: ", socket.id);

    // join event
    socket.on("join-event", (eventId, userPeerId, userEmail, nameOfUser) => {
        console.log(nameOfUser + " with email '" + userEmail + "' and peer id: '" + userPeerId + "' joined event: " + eventId);
        socket.join(eventId);
        socket.broadcast.to(eventId).emit('user-connected', userPeerId, userEmail, nameOfUser); 

        socket.on('disconnect', (reason) => {
            console.log("User with socket id disconnected: '" + socket.id +"' because '" + reason + "'");
            socket.broadcast.to(eventId).emit('user-disconnected', userPeerId, userEmail, nameOfUser);
        });
    })

    //listening for messages
    socket.on('incoming-message', async (data) => {
        console.log(`User ${socket.id}-(${data}) connected`)
        
        ///send message to the room in real-time
        //socket.broadcast.to(eventId).emit('new-message', data.eventId, data.email,data.username,data.isProctor,data.message);
        socket.broadcast.to(data.eventId).emit('new-message', data.eventId, data.username, data.email, data.isProctor, data.message, new Date()); 

        // save in the background
        try {
            const participant = await Participant.find({event_id: data.eventId});
            const chat = await addmessage({
                eventId: data.eventId,
                useremail:data.email,
                username: data.username,
                message: data.message,
                tagged:participant.filter(i => data.message.includes('@' + i._id)).map(i => i._id),
            });   
            
        } catch (error) {
            
        }
    })

    // Listen for typing activity 
    socket.on('on-typing', data => {
        //broadcast to everyone except you in the chatroom
        socket.broadcast.to(data.eventId).emit('activity', data)
    })
    
});



// making sure the DB is connected before starting the server
connectToDb().then(() => {
    // listening on the port defined above
    httpServer.listen(PORT, () => console.log("Server running on port " + PORT));
}).catch(err => {
    return { error: 'Failed to connect to DB' }
});
