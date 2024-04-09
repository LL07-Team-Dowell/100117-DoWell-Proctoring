const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { SchemaTypes } = require("mongoose");


const EventsChatStore = new Schema({
    event_id: {
        type: SchemaTypes.ObjectId,
        ref: 'Event',
        required: true,
    },
    name: {
        type: SchemaTypes.String,
        required: true,
    },
    text: {
        type: SchemaTypes.String,
        required: true,
    },
});

const validateEventsChatStore = (EventsChatStore) => {
    const schema = Joi.object({
        event_id: Joi.string().hex().required(),
        name: Joi.string().min(2).required(),
        text: Joi.string().required(),
    });
    return schema.validate(EventsChatStore);
};

const EventChatStore = model("EventsChatStore", EventsChatStore);

module.exports = {EventChatStore, validateEventsChatStore}