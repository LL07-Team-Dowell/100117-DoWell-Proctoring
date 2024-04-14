const { Message, validateMessage } = require('../models/messageModel');
const { generateDefaultResponseObject } = require("../utils/defaultResponseObject");
const { Event } = require('../models/eventModel');

exports.addmessage = async (data) => {
    try {
        // Validate request body
        const { error, value } = validateMessage(data);
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
        const foundEvent = await Event.findById(value.eventId);
        if (!foundEvent) {
            // If event not found, return 404
            return generateDefaultResponseObject({
                success: false,
                message: 'Event could not be found',
            });
        }

        // Create a new event chat entry
        const message = new Message({
            eventId: value.eventId,
            username: value.username,
            message: value.message,
            tagged: value.tagged
        });
        console.log("3")
        // Save the event chat entry to the database
        await message.save();

        // Return the created event chat entry
        return {
            success: true,
            message: "Event message created successfully",
            data: message,
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
exports.updatemessage = async (req, res) => {
    const { type } = req.params;
    const { value, error } = validateMessage(req.body, true);

    if (error) return res.status(400).json(generateDefaultResponseObject({
        success: false,
        message: error.details[0].message,
    }));
    console.log({...value});
    

    try {
        const message = await Message.findOneAndUpdate(
            { _id: value.messageId, eventId: value.eventId, editing_allowed: true }, 
            { $set: 
                {'message':value.message} 
            }, 
            { new: true }
        );
        
        if (!message) return res.status(404).json(generateDefaultResponseObject({
            success: false,
            message: 'Message details either does not exist or editing of details has been disabled',
        }));

        return res.status(200).json(generateDefaultResponseObject({
            success: true,
            message: 'Successfully updated Message details',
            data: message,
        }));

    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'An error occured trying to save Message details',
            error: error,
        }));
    }
}

exports.getByParams = async (req, res) => {
    let query = {};
    if (req.body.start_date) {
        query.createdAt = {
            $gte: req.body.start_date
        };
    }
    if (req.body.end_date) {
        query.createdAt = {
            $lte: req.body.end_date
        };
    }

    // Construct the query object dynamically based on the parameters received
    if (req.body.event_id) query.event_id = req.body.event_id;
    if (req.body.name) query.name = req.body.name;
    if (req.body._id) query._id = req.body._id;
    if (req.body.email) query.email = req.body.email;
    if (req.body.user_lat) query.user_lat = req.body.user_lat;
    if (req.body.user_lon) query.user_lon = req.body.user_lon;
    if (req.body.hours_spent_in_event) query.hours_spent_in_event = req.body.hours_spent_in_event;
    // Assuming createdAt is a direct property of the participant document
    if (req.body.createdAt) query.createdAt = req.body.createdAt;
    
    try {
        const participant = await Participant.find(query);
        return ResponseObject({
            success: true,
            message: 'Participants retrieved successfully',
            data: participant}, res.status(200));
    } catch (error) {
        return ResponseObject({
            success: false,
            message: 'Failed to retrieve participants',
            error: error,
        }, res.status(400));
    }
}
exports.harddelete = async (req, res) => {
    let query = {};
    if (req.body.start_date) {
        query.createdAt = {
            $gte: req.body.start_date
        };
    }
    if (req.body.end_date) {
        query.createdAt = {
            $lte: req.body.end_date
        };
    }

    // Construct the query object dynamically based on the parameters received
    if (req.body.event_id) query.event_id = req.body.event_id;
    if (req.body.name) query.name = req.body.name;
    if (req.body._id) query._id = req.body._id;
    if (req.body.email) query.email = req.body.email;
    if (req.body.user_lat) query.user_lat = req.body.user_lat;
    if (req.body.user_lon) query.user_lon = req.body.user_lon;
    if (req.body.hours_spent_in_event) query.hours_spent_in_event = req.body.hours_spent_in_event;
    // Assuming createdAt is a direct property of the participant document
    if (req.body.createdAt) query.createdAt = req.body.createdAt;
    
    try {
        const participants = await Participant.find(query);
        if (participants.length==0){
            return ResponseObject({
                success: false,
                message: 'No participants found matching query criteria'
            }, res.status(404));
        }
        for (let i = 0; i < participants.length; i++) {
            const id = participants[i]._id;
            const deletedparticipant = await Participant.findByIdAndDelete(id);
            
            if (!deletedparticipant) {
                return ResponseObject({
                    success: false,
                    message: 'Failed to retrieve participants',
                    error: `participant with id: ${id} not deleted`
                }, res.status(404));
            }
        }
        
        return ResponseObject({
            success: true,
            message: 'Successfully deleted participants(s).'}, res.status(200));
    } catch (error) {
        return ResponseObject({
            success: false,
            message: 'Failed to retrieve participants',
            error: error,
        }, res.status(400));
    }
}
exports.softdelete = async (req, res) => {
    let query = {};
    if (req.body.start_date) {
        query.createdAt = {
            $gte: req.body.start_date
        };
    }
    if (req.body.end_date) {
        query.createdAt = {
            ...query.createdAt,
            $lte: req.body.end_date
        };
    }

    // Construct the query object dynamically based on the parameters received
    if (req.body.event_id) query.event_id = req.body.event_id;
    if (req.body.name) query.name = req.body.name;
    if (req.body._id) query._id = req.body._id;
    if (req.body.email) query.email = req.body.email;
    if (req.body.user_lat) query.user_lat = req.body.user_lat;
    if (req.body.user_lon) query.user_lon = req.body.user_lon;
    if (req.body.hours_spent_in_event) query.hours_spent_in_event = req.body.hours_spent_in_event;
    if (req.body.createdAt) query.createdAt = req.body.createdAt;

    try {
        const participants = await Participant.find(query);
        if (participants.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'No participants found matching query criteria'
            });
        }
        for (let i = 0; i < participants.length; i++) {
            const id = participants[i]._id;
            // Soft delete by updating the deleted field to true
            const deletedparticipant = await Participant.findByIdAndUpdate(id, { deleted: true });
            if (!deletedparticipant) {
                return res.status(404).json({
                    success: false,
                    message: `Participant with id: ${id} not found`
                });
            }
        }
        return res.status(200).json({
            success: true,
            message: 'Successfully deleted participant(s)'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to delete participant(s)',
            error: error.message
        });
    }
}

