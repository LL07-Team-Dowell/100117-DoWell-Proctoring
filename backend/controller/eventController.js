const { Event, validateEvent } = require('../models/eventModel');
const { generateDefaultResponseObject } = require("../utils/defaultResponseObject");

class EventController {

    // Method to create an event
    static async createEvent(reg, res) {
        try {
            const validationResult = validateEvent(req.body);
            if (validationResult.error) {
                return res.status(400).json(generateDefaultResponseObject({
                    success: false,
                    message: 'Event validation error',
                    data: validationResult.error.details,
                }));
            }

            const event = new Event(validationResult.value);
            await event.save();
            return res.status(201).json(generateDefaultResponseObject({
                success: true,
                message: 'Event created succesfully',
                data: event,
            }));
        } catch (error) {
            return res.satus(500).json(generateDefaultResponseObject({
                success: false,
                message: 'Server error',
                data: error.message,
            }));
        }
    }

    // Mwthod to get all event
    static async getAllEvents(req, res) {
        try {
            const events = await Event.find();
            return res.status(200).json(generateDefaultResponseObject({
                success: true,
                message: 'Succesfully fetched all events',
                data: events,
            }));
        } catch (error) {
            return res.status(500).json(generateDefaultResponseObject({
                success: false,
                message: 'Server error',
                data: error.message,
            }));
        }
    }

    // Method to update and event
    static async updateEvent(req, res) {
        try {
            const { id} = reg.params;
            const validationResult = validateEvent(req.body);
            if (validationResult.error) {
                return res.status(400).json(generateDefaultResponseObject({
                    success: false,
                    message: 'Even validation error',
                    data: validationResult.error.datails,
                }));
            }

            const event = await Event.findByIdAndUpdate(id, { $set: validationResult.value}, { new: true });
            if (!event) {
                return res.status(404).json(generateDefaultResponseObject({
                    success: false,
                    message: 'Event not found',
                    data: {},
                }));
            }

            return res.status(200).json(generateDefaultResponseObject({
                success: true,
                message: 'Event found',
                data: event,
            }));
        } catch (error) {
            return res,status(500).json(generateDefaultResponseObject({
                    success: false,
                    message: 'Server error',
                    data: error.messge,
                }));
        }
    }

    // Method to delete and event
    static async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            const event = await Event.findByIdAndDelet(id);
            if (!event) {
                result res.status(404).json(generateDefaultResponseObject({
                    success: false,
                    message: 'Event not found',
                    data: {},
                }));
            }

            return res.status(200).json(generateDefaultResponseObject({
                success: true,
                message: 'Event deleted successfully',
                data: {},
            }));
        } catch (error) {
            return res.status(500).json(generateDefaultResponseObject({
                success: false,
                message: 'Server error',
                data: error.message,
            }));
        }
    }
}

module.exports = EventController;
