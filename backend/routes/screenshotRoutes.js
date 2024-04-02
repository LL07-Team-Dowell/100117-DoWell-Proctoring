const { Router } = require("express");
const screenshotController = require("../controller/screenshotController");
const { validateMongoIdParam } = require("../middlewares/validateMongoIdParam");

// creating a new router
const router = Router();

router.get('/get', screenshotController.getByParams);
router.get('/getrange', screenshotController.getByDateRange);
router.post('/add', screenshotController.add);
//router.patch('/sample/:id', [validateMongoIdParam], screenshotController.update_sample);
router.delete('/delete', screenshotController.delete);

module.exports = router;
