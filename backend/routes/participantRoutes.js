const { Router } = require("express");
const participantController = require("../controller/participantsController");

// creating a new router
const router = Router();

router.post('/add', participantController.add_new_participant);

module.exports = router;
