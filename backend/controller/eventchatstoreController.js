const { EventChatStore, validateEventsChatStore } = require('../models/eventschatstoreModel');
const { generateDefaultResponseObject } = require("../utils/defaultResponseObject");
const { Event } = require('../models/eventModel');

const createEventChat = async (data) => {
    try {
        // Validate request body
        const { error, value } = validateEventsChatStore(data);
        //const { error, value } = validateEventsChatStore(data);
        if (error) {
            return {
                success: false,
                message: error.details[0].message,
                data: null,
                error: null
            };
        }

        // Check if the event referenced by event_id exists
        const foundEvent = await Event.findById(value.event_id);
        if (!foundEvent) {
            // If event not found, return 404
            return generateDefaultResponseObject({
                success: false,
                message: 'Event could not be found',
            });
        }

        // Create a new event chat entry
        const eventChat = new EventChatStore({
            email: value.email,
            event_id: value.event_id,
            username: value.username,
            message_id: value.message_id,
            message: value.message,
            tagged: value.tagged
        });
        console.log("3")
        // Save the event chat entry to the database
        await eventChat.save();

        // Return the created event chat entry
        return {
            success: true,
            message: "Event chat created successfully",
            data: eventChat,
            error: null
        };
    } catch (err) {
        // Handle errors
        console.error("Error creating event chat:", err);
        return {
            success: false,
            message: "Internal Server Error",
            data: null,
            error: err.message
        };
    }
};

module.exports = {
    createEventChat
};
