const {
  generateDefaultResponseObject,
} = require("../utils/defaultResponseObject");
const { Event } = require("../models/eventModel");
const { Participant } = require("../models/participantModel");
const { Message } = require("../models/messageModel");
const { default: mongoose } = require("mongoose");

class DashboardController {
  static getDateRangeFilter(start, end) {
    const startDate = start ? new Date(start) : new Date("1970-01-01");
    const endDate = end ? new Date(end) : new Date("2100-01-01");

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date range");
    }

    return { $gte: startDate, $lte: endDate };
  }

  static async getDashboardData(req, res) {
    try {
      const { userId, startDate, endDate } = req.query;
      if (!userId) {
        return res.status(400).json(
          generateDefaultResponseObject({
            success: false,
            message: "User ID is required",
            data: null,
            error: null,
          })
        );
      }
      const dateRangeFilter = DashboardController.getDateRangeFilter(
        startDate,
        endDate
      );

      // Fetch the number of events for the specific user
      const events = await Event.find({
        start_time: dateRangeFilter,
        user_id: userId,
      });

      // Fetch participants and messages for the specific user's events
      const participants = await Participant.find({
        event_id: { $in: events.map((event) => event._id) },
      });
      const messages = await Message.find({
        eventId: { $in: events.map((event) => event._id) },
      });

      // Filter events with at least one participant
      const eventsWithParticipants = events.filter((event) =>
        participants.some((participant) =>
          participant.event_id.equals(event._id)
        )
      );
      const numberOfEventsWithParticipants = eventsWithParticipants.length;

      // Filter events with at least one message
      const eventsWithMessages = events.filter((event) =>
        messages.some((message) => message.eventId.equals(event._id))
      );
      const numberOfEventsWithMessages = eventsWithMessages.length;

      // Calculate participants per event
      const participantsPerEvent = {};
      eventsWithParticipants.forEach((event) => {
        participantsPerEvent[event.name] = participants.filter((participant) =>
          participant.event_id.equals(event._id)
        ).length;
      });

      // Calculate messages per event
      const messagesPerEvent = {};
      eventsWithMessages.forEach((event) => {
        messagesPerEvent[event.name] = messages.filter((message) =>
          message.eventId.equals(event._id)
        ).length;
      });

      // Filter valid locations
      const validParticipants = participants.filter(
        (participant) =>
          participant.user_lat !== undefined &&
          participant.user_lon !== undefined
      );

      // Calculate the most and least common locations
      const locationCounts = validParticipants.reduce((acc, participant) => {
        const locationKey = `${participant.user_lat},${participant.user_lon}`;
        if (acc[locationKey]) {
          acc[locationKey]++;
        } else {
          acc[locationKey] = 1;
        }
        return acc;
      }, {});

      const locations = Object.keys(locationCounts);
      const mostCommonLocation = locations.reduce(
        (a, b) => (locationCounts[a] > locationCounts[b] ? a : b),
        locations[0]
      );
      const leastCommonLocation = locations.reduce(
        (a, b) => (locationCounts[a] < locationCounts[b] ? a : b),
        locations[0]
      );

      // Prepare response
      const response = {
        events: {
          total_events: events.length,
          events_with_registered_participants: numberOfEventsWithParticipants,
          event_with_messages: numberOfEventsWithMessages,
        },
        participants: {
          total_participants: participants.length,
          valid_participants: validParticipants.length,
        },
        participantsPerEvent,
        total_messages_exchanged_in_events: messages.length,
        messagesPerEvent,
        mostCommonLocation,
        leastCommonLocation,
      };

      res.status(200).json(
        generateDefaultResponseObject({
          success: true,
          message: "Success",
          data: response,
          error: null,
        })
      );
    } catch (error) {
      res.status(500).json(
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

module.exports = DashboardController;
