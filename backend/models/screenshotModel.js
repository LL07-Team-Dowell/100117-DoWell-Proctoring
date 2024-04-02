const Joi = require("joi");
const { Schema, SchemaTypes, model } = require("mongoose");

//screenshot schema
const screenshotSchema = new Schema({
    event_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"Event"
    },
    user_id: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    company_id: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    name: {
        type: SchemaTypes.String,
        required: true,
    },
    email: {
        type: SchemaTypes.String,
        required: true,
    },
    image: {
        type: SchemaTypes.String,
        required: true,
    },
}, {timestamps:true})


// function to validate screenshot data
const validateScreenShotData = (ScreenShotData) => {
    const validation = Joi.object({
        event_id:Joi.string().length(24).hex().required(),
        user_id: Joi.alternatives().try(Joi.string().length(24).hex()).required(),
        company_id: Joi.alternatives().try(Joi.string().length(24).hex()).required(),
        name: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        image: Joi.string().required(),
    })
    return validation.validate(ScreenShotData);
}

// model for screenshots
const ScreenShot = model('ScreenShot', screenshotSchema);

module.exports = {
    ScreenShot,
    validateScreenShotData,
}