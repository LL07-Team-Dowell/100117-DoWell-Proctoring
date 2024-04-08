const { Router } = require("express");
const participantController = require("../controller/participantsController");

// creating a new router
const router = Router();

router.post('/add', participantController.add_new_participant);
router.get('/get', participantController.getByParams);
router.delete('/harddelete', participantController.harddelete);
router.patch('/softdelete', participantController.softdelete);

module.exports = router;
