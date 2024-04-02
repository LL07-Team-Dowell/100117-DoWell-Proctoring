
const { Eyetracking, validateEyetracking } = require("../models/eyetrackingmodel");
const { generateDefaultResponseObject } = require("../utils/defaultResponseObject");

const get_all_eyetracking = async (req, res) => {
    try {
        const eyetrackingData = await Eyetracking.find();
        res.status(200).json(generateDefaultResponseObject({
            success: true,
            message: "hello",
            data: eyetrackingData
        }));
    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: '',
        }))
    }
};


const get_single_eyetracking = async (req, res) => {
    try {
        const eyetrackingData = await Eyetracking.findById(req.params.id);
        if (!eyetrackingData) {
            return res.status(404).json({ error: "Eyetracking data not found" });
        }
        res.status(200).json(eyetrackingData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create_new_eyetracking = async (req, res) => {
    try {
        const { error, value } = validateEyetracking(req.body);
        if (error) {
            return res.status(400).json(generateDefaultResponseObject({
                success: false,
                message: error.details[0].message,
            }));
        }

        const eyetrackingData = new Eyetracking(value);
        await eyetrackingData.save();

        return res.status(201).json(generateDefaultResponseObject({
            success: true,
            message: 'Successfully created new eyetracking data.',
            data: eyetrackingData,
        }));
    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'Failed to create new eyetracking data',
        }));
    }
};



const update_eyetracking = async (req, res) => {
    const { error } = validateEyetracking(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const eyetrackingData = await Eyetracking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!eyetrackingData) {
            return res.status(404).json({ error: "Eyetracking data not found" });
        }
        res.status(200).json(eyetrackingData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const delete_eyetracking = async (req, res) => {
    try {
        const eyetrackingData = await Eyetracking.findByIdAndDelete(req.params.id);
        if (!eyetrackingData) {
            return res.status(404).json({ error: "Eyetracking data not found" });
        }
        res.status(204).json({
            success: true,
            message: "Eyetracking data deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    get_all_eyetracking,
    get_single_eyetracking,
    create_new_eyetracking,
    update_eyetracking,
    delete_eyetracking
};