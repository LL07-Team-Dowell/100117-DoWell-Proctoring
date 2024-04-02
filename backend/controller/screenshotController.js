const { ScreenShot, validateScreenShotData } = require("../models/screenshotModel");
const { ResponseObject } = require("../utils/defaultResponseObject");

exports.add = async (req, res) => {
    const { error, value } = validateScreenShotData(req.body);
    if (error) {
        return ResponseObject({
            success: false,
            message: error.details[0].message,
        }, res.status(400));
    }

    try {
        const existingWithEventId = await ScreenShot.findOne({ event_id: value.event_id });
        if (existingWithEventId) {
            return ResponseObject({
                success: false,
                message: `Screenshots with "Event Id: "+ ${value.event_id} already exists`,
            }, res.status(409));
        }

        const newScreenShot = new ScreenShot(value);
        await newScreenShot.save();

        return ResponseObject({
            success: true,
            message: `Screenshots created successfully`,
            response: newScreenShot,
        }, res.status(201));

    } catch (error) {
        return ResponseObject({
            success: false,
            message: 'ScreenShot failed to be created',
        }, res.status(500));
    }
}

exports.getByParams = async (req, res) => {
    try {
        const screenshots = await ScreenShot.find(req.body);
        return ResponseObject({
            success: true,
            message: 'Screenshots retrieved successfully',
            response: screenshots}, res.status(200));
    } catch (error) {
        return ResponseObject({
            success: false,
            message: 'Failed to retrieve screenshots'}, res.status(400));
    }
}
exports.getByDateRange = async (req, res) => {
    let query = {
        createdAt: {
            $gte: req.body.start_date,
            $lte: req.body.end_date,
        },
    };

    // Construct the query object dynamically based on the parameters received
    if (req.body.event_id) query.event_id = req.body.event_id;
    if (req.body.name) query.name = req.body.name;
    if (req.body.user_id) query.user_id = req.body.user_id;
    if (req.body.company_id) query.company_id = req.body.company_id;
    if (req.body.createdAt) query.createdAt = req.body.createdAt;
    
    try {
        const screenshots = await ScreenShot.find(query);
        return ResponseObject({
            success: true,
            message: 'Screenshots retrieved successfully',
            response: screenshots}, res.status(200));
    } catch (error) {
        return ResponseObject({
            success: false,
            message: 'Failed to retrieve screenshots'}, res.status(400));
    }
}

exports.delete = async (req, res) => {
    let query = {
        createdAt: {
            $gte: req.body.start_date,
            $lte: req.body.end_date,
        },
    };

    // Construct the query object dynamically based on the parameters received
    if (req.body.event_id) query.event_id = req.body.event_id;
    if (req.body.name) query.name = req.body.name;
    if (req.body.user_id) query.user_id = req.body.user_id;
    if (req.body.company_id) query.company_id = req.body.company_id;
    if (req.body.createdAt) query.createdAt = req.body.createdAt;

    try {
        const screenshots = await ScreenShot.find(query);
        console.log(`${screenshots.length} ScreenShot(s) found`);

        for (let i = 0; i < screenshots.length; i++) {
            console.log(`${screenshots.length} ----ScreenShot(s) found`);
            const id = screenshots[i]._id;
            const deletedScreenshots = await ScreenShot.findByIdAndDelete(id);
            
            if (!deletedScreenshots) {
                return ResponseObject({
                    success: false,
                    message: 'Failed to retrieve screenshots',
                    response: `Screen shot with id: ${id} not deleted`
                }, res.status(404));
            }
        }
        
        return ResponseObject({
            success: true,
            message: 'Successfully deleted ScreenShot(s).'}, res.status(200));

    } catch (error) {
        return ResponseObject({
            success: true,
            message: 'Failed to deleted ScreenShot(s).', response:error.message}, res.status(500));
    }
}

