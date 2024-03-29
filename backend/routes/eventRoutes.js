const { Router } = require("express");
const EventController = require('../controller/eventController');
const { validateMongoIdParam } = require("../middlewares/validateMongoIdParam");

// creating a new router
const router = Router();

router.get('/events', EventController.getAllEvents);
router.post('/events', EventController.createEvent);
router.put('/events/:id', [validateMongoIdParam], EventController.updateEvent);
router.delete('/events/:id', [validateMongoIdParam], EventController.deleteEvent);

module.exports = router;