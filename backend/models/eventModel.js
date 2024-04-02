const Joi = require("joi");
const { Schema, SchemaTypes, model } = require("mongoose");

const eventSchema = new Schema({
    start_time: {
        type: SchemaTypes.Date,
        required: true,
    },
    duration_in_hours: {
        type: SchemaTypes.Number,
        required: true,
    },
    user_id: {
        type: SchemaTypes.String,
        required: true,
    },
    participants: {
        type: SchemaTypes.Array,
        default: []
    },
    max_cap: {
        type: SchemaTypes.Number,
    }
});


const validateEvent = (eventData, isExistingData=false) => {
    let eventValidationSchema;

    if (isExistingData) {
        eventValidationSchema = Joi.object({
            start_time: Joi.date(),
            duration_in_hours: Joi.number(),
            user_id: Joi.string(),
            participants: Joi.array().items(Joi.string()),
            max_cap: Joi.number()
        });

        return eventValidationSchema.validate(eventData);
    } else {
        eventValidationSchema = Joi.object({
            start_time: Joi.date().required(),
            duration_in_hours: Joi.number().required(),
            user_id: Joi.string().required(),
            participants: Joi.array().items(Joi.string()),
            max_cap: Joi.number()
        });

        return eventValidationSchema.validate(eventData);
    }
}

const Event = model("Event", eventSchema);

module.exports = {
    Event,
    validateEvent,
}
