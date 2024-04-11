const { EventChatStore, validateEventsChatStore } = require('../models/eventschatstoreModel');
const Event = require('../models/eventModel');
const ObjectId = require('mongoose').Types.ObjectId;

const createEventChat = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = validateEventsChatStore(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                data: null,
                error: null
            });
        }

        // Check if the event referenced by event_id exists
        const foundEvent = await Event.findById(value.event_id);
        if (!foundEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
                data: null,
                error: null
            });
        }
        // Create a new event chat entry
        const eventChat = new EventChatStore({
            event_id: value.event_id,
            name: value.name,
            text: value.text
        });

        // Save the event chat entry to the database
        await eventChat.save();

        // Return the created event chat entry
        return res.status(201).json({
            success: true,
            message: "Event chat created successfully",
            data: eventChat,
            error: null
        });
    } catch (err) {
        // Handle errors
        console.error("Error creating event chat:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null,
            error: err.message
        });
    }
};

module.exports = {
    createEventChat
};
