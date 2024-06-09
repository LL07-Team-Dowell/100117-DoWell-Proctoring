// necessary imports
require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const PORT = 5000;
const { createServer } = require("http");
const { Server } = require("socket.io");
const { connectToDb } = require('./config/db');
const { loadModels } = require('./utils/faceDetectorUtils');
const { Participant } = require("./models/participantModel");
const { addmessage } = require('./controller/messageController'); 
const adminInit = require('./utils/admin.kafka');
const {callProducer,producerRun, consumerRun} = require('./utils/kafka');
const TOPICS = JSON.parse(process.env.KAFKA_TOPIC);

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
    methods: ["GET", "POST"],
  }
})

// dictionary to temporarily hold peer ids of users in event
const eventDictForPeerIds = {};

// listening when a client connects to our socket instance
io.on("connection", (socket) => {
  console.log("connected with: ", socket.id);
  

  // join event
  socket.on("join-event", (eventId, userPeerId, userEmail, nameOfUser, userSocketId) => {
    console.log(nameOfUser + " with email '" + userEmail + "' and peer id: '" + userPeerId + "' joined event: " + eventId);
    socket.join(eventId);

    const newPeerForEvent = {
      peerId: userPeerId,
      email: userEmail,
      nameOfUser,
      socketId: userSocketId,
    };

    if (eventDictForPeerIds[eventId]) {
      if (!eventDictForPeerIds[eventId]?.find(item => item.peerId === userPeerId || item.email === userEmail)) eventDictForPeerIds[eventId]?.push(newPeerForEvent);
    } else {
      eventDictForPeerIds[eventId] = [newPeerForEvent];
    }

    io.to(socket.id).emit('current-connected-users', eventDictForPeerIds[eventId]);

    socket.broadcast.to(eventId).emit('user-connected', userPeerId, userEmail, nameOfUser, userSocketId); 

    socket.on('disconnect', async (reason) => {
      console.log("User with socket id disconnected: '" + socket.id +"' because '" + reason + "'");
      if (eventDictForPeerIds[eventId]) {
        const copyOfCurrentIds = [...eventDictForPeerIds[eventId]];
        eventDictForPeerIds[eventDictForPeerIds] = copyOfCurrentIds.filter(item => item.peerId !== userPeerId || item.email === userEmail);
      }

      socket.broadcast.to(eventId).emit('user-disconnected', userPeerId, userEmail, nameOfUser, userSocketId);
    });
  })

  //listening for messages
  socket.on('incoming-message', async (data) => {
    console.log(`New message from user with socket id: ${socket.id} ->>> (${data})`);
        
    ///send message to the room in real-time
    socket.broadcast.to(data.eventId).emit('new-message', data.eventId, data.username, data.email, data.isProctor, data.message, new Date());
    // io.to(data.eventId).emit('new-message', data.eventId, data.username, data.email, data.isProctor, data.message, new Date()); 

    // save in the background
    try {
      const participant = await Participant.find({event_id: data.eventId});
      const message = {
        eventId: data.eventId,
        useremail: data.email,
        username: data.username,
        message: data.message,
        tagged: participant.filter(i => data.message.includes('@' + i._id)).map(i => i._id),
      };
      await producerRun(message);  
            
    } catch (error) {
            
    }
  })

  // Listen for typing activity 
  socket.on('on-typing', data => {
    //broadcast to everyone except you in the chatroom
    socket.broadcast.to(data.eventId).emit('activity', data)
  })

  // get current user details in event
  socket.on('get-users-in-event', (eventId) => {
    io.to(socket.id).emit('current-users', eventDictForPeerIds[eventId]);
  });
});

function startServer() {
  httpServer.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await adminInit(TOPICS);
    await consumerRun("realtime-messages", TOPICS);

    // testing the producer-----
    // const message = {
    //   eventId: '123344',
    //   useremail:'test@gmail.com',
    //   username: 'oscaroguledo',
    //   message: 'a test message',
    //   tagged:['oscar', 'john'],
    // };
    //await callProducer(message);
  });
}

async function initializeApp() {
  try {
    // Connect to database
    await connectToDb();

    // Load face detection models
    await loadModels();
    console.log("Face detector AI Models loaded successfully.");

    // Start the server
    startServer();
  } catch (error) {
    console.error("Initialization failed:", error);
    process.exit(1);
  }
}

initializeApp();
