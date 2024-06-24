const {
  generateDefaultResponseObject,
} = require("../utils/defaultResponseObject");
const { Event, validateEvent } = require("../models/eventModel");
const { default: mongoose } = require("mongoose");

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

  
  // Method to get all events
  static async getAllEvents(req, res) {
    try {
      const { user_id, page = 1 } = req.query;
      console.log(`hiiii: ${user_id}`)
      const limit = 20;
      const skip = (page - 1) * limit;

      const matchStage = user_id ? { user_id: user_id } : {};

      // Count total events
      const totalEventsCount = await Event.countDocuments(matchStage);

      // Prepare the aggregation pipeline
      const pipeline = [
        {
          $match: matchStage
        },
        {
          $lookup: {
            from: "participants", 
            localField: "_id", // The field from the "events" collection
            foreignField: "event_id", // The field from the "participants" collection
            as: "active_participants" 
          }
        },
        {
          $sort: {
            createdAt: -1 // Sort by createdAt field in descending order
          }
        },
        {
          $skip: skip
        },
        {
          $limit: limit
        }
      ];

      const events = await Event.aggregate(pipeline);

      const totalPages = Math.ceil(totalEventsCount / limit);
      const nextPage = page < totalPages ? parseInt(page) + 1 : null;
      const prevPage = page > 1 ? parseInt(page) - 1 : null;

      return res.status(200).json(generateDefaultResponseObject({
        success: true,
        message: 'Successfully fetched all events with participants',
        data: {
          pagination: {
            totalEventsCount,
            totalPages,
            currentPage: parseInt(page),
            nextPage,
            prevPage
          },
          events
        },
        error: null,
      }));
    } catch (error) {
      // Handle errors and send the error response
      return res.status(500).json(generateDefaultResponseObject({
        success: false,
        message: error.message,
        data: null,
        error: error.message,
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

      const pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          }
        },
        {
          $lookup: {
            from: "participants", 
            localField: "_id", // The field from the "events" collection
            foreignField: "event_id", // The field from the "participants" collection
            as: "active_participants" 
          }
        },
      ];

      const matchingEvent = await Event.aggregate(pipeline);
      const event = matchingEvent?.length > 0 ? matchingEvent[0] : null;
      
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

  static async getEventReport(req, res) {
    try {
      const { id } = req.params;
  
      const pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          }
        },
        {
          $lookup: {
            from: "participants", 
            localField: "_id", // The field from the "events" collection
            foreignField: "event_id", // The field from the "participants" collection
            as: "active_participants" 
          }
        },
      ];
  
      const matchingEvent = await Event.aggregate(pipeline);
      const event = matchingEvent?.length > 0 ? matchingEvent[0] : null;
  
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
  
      const activeParticipants = Array.isArray(event.active_participants) ? event.active_participants : [];
  
      // Define your behavior-based criteria here
      const goodParticipants = activeParticipants.filter(p => {
        return p.hours_spent_in_event > 1 && !p.deleted;
      });
  
      const badParticipants = activeParticipants.filter(p => {
        return p.hours_spent_in_event <= 1 || p.deleted;
      });
      
  
      // Calculate average time spent
      const totalHoursSpent = activeParticipants.reduce((sum, participant) => sum + (participant.hours_spent_in_event || 0), 0);
      const averageTimeSpent = activeParticipants.length > 0 ? (totalHoursSpent / activeParticipants.length) : 0;
      
  
      const report = {
        proctors: {
          total: 1,
          ids: [event.user_id]
        },
        active_participants: {
          total: activeParticipants.length,
          ids: activeParticipants.map(participant => ({
            id: participant._id,
            time_joined: participant.createdAt,
            time_registered: participant.updatedAt,
            location: {
              lat: participant.user_lat,
              lon: participant.user_lon
            }
          })),
          good: {
            total: goodParticipants.length,
            ids: goodParticipants.map(p => ({
              id: p._id,
              time_joined: p.createdAt,
              time_registered: p.updatedAt,
              location: {
                lat: p.user_lat,
                lon: p.user_lon
              }
            }))
          },
          bad: {
            total: badParticipants.length,
            ids: badParticipants.map(p => ({
              id: p._id,
              time_joined: p.createdAt,
              time_registered: p.updatedAt,
              location: {
                lat: p.user_lat,
                lon: p.user_lon
              }
            }))
          }
        },
        duration: event.duration_in_hours + " hours",
        start_time: event.start_time,
        end_time: event.close_date,
        locations: {}, // This will be filled up by frontend as mentioned
        average_time_spent: averageTimeSpent // New field added here
      };
  
      return res.status(200).json(
        generateDefaultResponseObject({
          success: true,
          message: "Successfully fetched event report",
          data: report,
          error: null,
        })
      );
    } catch (error) {
      return res.status(500).json(
        generateDefaultResponseObject({
          success: false,
          message: error.message,
          data: null,
          error: error.message,
        })
      );
    }
  }
}

module.exports = EventController;
