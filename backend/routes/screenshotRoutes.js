const { Router } = require("express");
const screenshotController = require("../controller/screenshotController");
const { validateMongoIdParam } = require("../middlewares/validateMongoIdParam");

// creating a new router
const router = Router();

//router.get('/all', screenshotController.get_all_samples);
//router.get('/sample/:id', [validateMongoIdParam], screenshotController.get_single_sample);
router.post('/add', screenshotController.add);
//router.patch('/sample/:id', [validateMongoIdParam], screenshotController.update_sample);
//router.delete('/sample/:id', [validateMongoIdParam], screenshotController.delete_sample);

module.exports = router;
