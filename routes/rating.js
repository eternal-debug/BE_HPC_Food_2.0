const router = require('express').Router();
const ratingController = require('../controllers/ratingController');
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken');

router.post('/', verifyTokenAndAuthorization, ratingController.addRating);
router.get('/', verifyTokenAndAuthorization, ratingController.checkUserRating);

module.exports = router;