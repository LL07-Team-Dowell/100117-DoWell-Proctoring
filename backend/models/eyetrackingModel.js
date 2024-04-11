const Joi = require("joi");
const { Schema, model } = require("mongoose");
const Event = require("./eventModel");

const eyetrackingSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    event_id: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
});

const validateEyetracking = (eyetracking) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        image: Joi.string().required(),
        event_id: Joi.string().required(),
    });
    return schema.validate(eyetracking);
};

const Eyetracking = model("Eyetracking", eyetrackingSchema);

module.exports = { Eyetracking, validateEyetracking };
