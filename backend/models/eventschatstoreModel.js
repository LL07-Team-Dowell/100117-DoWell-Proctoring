const Joi = require("joi");
const { Schema, SchemaTypes, model } = require("mongoose"); // Adjust import statement
const { ObjectId } = SchemaTypes; // Import ObjectId explicitly
const Event = require("./eventModel");

const eventsChatStoreSchema = new Schema({
    email: {
        type: SchemaTypes.String,
        required: true,
    },
    event_id: {
        type: ObjectId,
        ref: 'Event',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    message_id: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    tagged:{
        type:Array,
        required:true,
    }
});

const validateEventsChatStore = (eventsChatStoreObject) => {
    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        event_id: Joi.string().hex().required(),
        username: Joi.string().min(2).required(),
        message_id: Joi.string().required(),
        message: Joi.string().required(),
        tagged:Joi.array().required(),
    });
    return schema.validate(eventsChatStoreObject);
};

const EventChatStore = model("EventChatStore", eventsChatStoreSchema);

module.exports = { EventChatStore, validateEventsChatStore };
