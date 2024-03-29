const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema({
    start_time: {
        type: Date,
        required: true,
    },
    duration_in_hours: {
        type: Number,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    participants: {
        type: Array,
        default: []
    },
    max_cap: {
        type: Number,
    }
});


const Event = model("Event", eventSchema);

const validateEvent = (evenData) => {
    const eventValidationSchema = Joi.object({
        start_time: Joi.date().required(),
        duration_in_hours: Joi.number().required(),
        user_id: Joi.string().required(),
        participants: Joi.array().items(Joi.string()),
        max_cap: Joi.number().required().max(100)
    });

    return eventValidationSchema.validate(eventData);
}

module.export = {
    Event,
    validateEvent,
}
