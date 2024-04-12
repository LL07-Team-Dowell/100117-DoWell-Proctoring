// necessary imports
require('dotenv').config();

const express = require("express");
const PORT = process.env.PORT || 5000;
const { createServer } = require("http");
const { Server } = require("socket.io");
const { connectToDb } = require('./config/db');

// creating a new express application
const app = express();

// adding routes and external configurations to the application
require('./config/config')(app);

// creating a new server using the express application to allow socket io also listen on the server
const httpServer = createServer(app);

// configuring a new socket io instance
const io = new Server(httpServer, {
    cors: process.env.FRONTEND_URL,
    
    methods: ["GET", "POST"]
})

// listening when a client connects to our socket instance
io.on("connection", (socket) => {
    console.log("connected with: ", socket.id);

    socket.on("join-event", (eventId, userPeerId, userEmail, nameOfUser) => {
        console.log(nameOfUser + " with email '" + userEmail + "' and peer id: '" + userPeerId + "' joined event: " + eventId);
        
        socket.join(eventId);
        socket.broadcast.to(eventId).emit('user-connected', userPeerId, userEmail, nameOfUser); 

        socket.on('disconnect', (reason) => {
            console.log("User with socket id disconnected: '" + socket.id +"' because '" + reason + "'");
            socket.broadcast.to(eventId).emit('user-disconnected', userPeerId, userEmail, nameOfUser);
        });
        //listening for messages
        socket.on('incoming-message', data => {
            console.log(`User ${socket.id}-(${data}) connected`)

            console.log(data.username + " with email '" + data.email + "' and proctor: '" + data.isProctor + "' messaged: " + data.eventId);
            ///send message to the room
            //socket.broadcast.to(eventId).emit('new-message', data.eventId, data.email,data.username,data.isProctor,data.message);
            io.to(eventId).emit('new-message', data.eventId, data.email,data.username,data.isProctor,data.messageid,data.message);

            ///add to the database--
            // call the controller function--
        })

        // Listen for activity 
        socket.on('on-typing', data => {
            //broadcast to everyone except you in the chatroom
            socket.broadcast.to(eventId).emit('activity', data)
        })
        
    })
    
});



// making sure the DB is connected before starting the server
connectToDb().then(() => {
    // listening on the port defined above
    httpServer.listen(PORT, () => console.log("Server running on port " + PORT));
}).catch(err => {
    return { error: 'Failed to connect to DB' }
});
