const { generateDefaultResponseObject } = require("../utils/defaultResponseObject");
const { validateParticipantData, Participant } = require("../models/participantModel");
const { Event } = require("../models/eventModel");

exports.add_new_participant = async (req, res) => {
    const { error, value } = validateParticipantData(req.body);

    if (error) return res.status(400).json(generateDefaultResponseObject({
        success: false,
        message: error.details[0].message,
    }));

    let foundEvent, existingParticipant;

    try {
        const promises = await Promise.all([
            Event.findById(value.event_id),
            Participant.findOne({ 
                email: value.email.toLocaleLowerCase(), 
                event_id: value.event_id 
            })
        ])

        foundEvent = promises[0];
        existingParticipant = promises[1];

        if (!foundEvent) return res.status(404).json(generateDefaultResponseObject({
            success: false,
            message: 'Event could not be found',
        }));

        if (existingParticipant) return res.status(409).json(generateDefaultResponseObject({
            success: false,
            message: 'Participant has already been registered for event',
            data: existingParticipant,
        }));

    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'An error occured trying to save participant details',
            error: error,
        }));
    }

    if (new Date().getTime() > new Date(foundEvent?.close_date).getTime()) return res.status(403).json(generateDefaultResponseObject({
        success: false,
        message: `Sorry, this event closed on ${new Date(foundEvent?.close_date).toDateString()} at ${new Date(foundEvent?.close_date).toLocaleTimeString()}`,
    }));

    const newParticipant = new Participant({ ...value, email: value.email.toLocaleLowerCase(), time_started: new Date() });

    try {
        await newParticipant.save();

        return res.status(200).json(generateDefaultResponseObject({
            success: true,
            message: 'Successfully saved participant details for event',
            data: newParticipant,
        }))
    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'An error occured trying to save participant details',
            error: error,
        }));   
    }
}