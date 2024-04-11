const Joi = require("joi");
const { Schema, SchemaTypes, model } = require("mongoose"); // Adjust import statement
const { ObjectId } = SchemaTypes; // Import ObjectId explicitly
const Event = require("./eventModel");

const eventsChatStoreSchema = new Schema({
    event_id: {
        type: ObjectId,
        ref: 'Event',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});

const validateEventsChatStore = (eventsChatStoreObject) => {
    const schema = Joi.object({
        event_id: Joi.string().hex().required(),
        name: Joi.string().min(2).required(),
        text: Joi.string().required(),
    });
    return schema.validate(eventsChatStoreObject);
};

const EventChatStore = model("EventChatStore", eventsChatStoreSchema);

module.exports = { EventChatStore, validateEventsChatStore };
