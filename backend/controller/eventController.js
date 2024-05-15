const {
  generateDefaultResponseObject,
} = require("../utils/defaultResponseObject");
const { Event, validateEvent } = require("../models/eventModel");

class EventController {
  // Method to create an event
  static async createEvent(req, res) {
    try {
      const validationResult = validateEvent(req.body);
      if (validationResult.error) {
        return res.status(400).json(
          generateDefaultResponseObject({
            success: false,
            message: validationResult.error.details[0].message,
            data: null,
            error: null,
          })
        );
      }

      const event = new Event(validationResult.value);
      await event.save();
      return res.status(201).json(
        generateDefaultResponseObject({
          success: true,
          message: "Event created successfully",
          data: event,
          error: null,
        })
      );
    } catch (error) {
      return res.status(500).json(
        generateDefaultResponseObject({
          success: false,
          message: error.message,
          data: null,
          error: null,
        })
      );
    }
  }

  // Mwthod to get all event
  static async getAllEvents(req, res) {
      try {
          const { user_id } = req.query;
          
          const pipeline = [
              {
                  $lookup: {
                      from: "participants", 
                      localField: "_id", // The field from the "events" collection
                      foreignField: "event_id", // The field from the "participants" collection
                      as: "active_participants" 
                  }
              }
          ];

          if (user_id) {
              pipeline.unshift({
                  $match: {
                      user_id: user_id
                  }
              });
          }

          const events = await Event.aggregate(pipeline);
          
          return res.status(200).json(generateDefaultResponseObject({
              success: true,
              message: 'Successfully fetched all events with participants',
              data: events,
              error: null,
          }));
      } catch (error) {
          // Handle errors and send the error response
          return res.status(500).json(generateDefaultResponseObject({
              success: false,
              message: error.message,
              data: null,
              error: null,
          }));
      }
  }

  // Method to update and event
  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const validationResult = validateEvent(req.body, true);
      if (validationResult.error) {
        return res.status(400).json(
          generateDefaultResponseObject({
            success: false,
            message: validationResult.error.details[0].message,
            data: null,
            error: null,
          })
        );
      }

      const event = await Event.findByIdAndUpdate(
        id,
        { $set: validationResult.value },
        { new: true }
      );
      if (!event) {
        return res.status(404).json(
          generateDefaultResponseObject({
            success: false,
            message: "Event not found",
            data: {},
            error: null,
          })
        );
      }

      return res.status(200).json(
        generateDefaultResponseObject({
          success: true,
          message: "Event Updated",
          data: event,
          error: null,
        })
      );
    } catch (error) {
      return res.status(500).json(
        generateDefaultResponseObject({
          success: false,
          message: error.messge,
          data: null,
          error: null,
        })
      );
    }
  }

  // Method to get a single event by ID
  static async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json(
          generateDefaultResponseObject({
            success: false,
            message: "Event not found",
            data: null,
            error: null,
          })
        );
      }

      return res.status(200).json(
        generateDefaultResponseObject({
          success: true,
          message: "Successfully fetched the event",
          data: event,
          error: null,
        })
      );
    } catch (error) {
      return res.status(500).json(
        generateDefaultResponseObject({
          success: false,
          message: error.message,
          data: null,
          error: null,
        })
      );
    }
  }

  // Method to delete and event
  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByIdAndDelete(id);
      if (!event) {
        return res.status(404).json(
          generateDefaultResponseObject({
            success: false,
            message: "Event not found",
            data: {},
            error: null,
          })
        );
      }

      return res.status(200).json(
        generateDefaultResponseObject({
          success: true,
          message: "Event deleted successfully",
          data: {},
          error: null,
        })
      );
    } catch (error) {
      return res.status(500).json(
        generateDefaultResponseObject({
          success: false,
          message: error.message,
          data: null,
          error: null,
        })
      );
    }
  }
}

module.exports = EventController;
