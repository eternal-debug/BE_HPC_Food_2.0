const router = require('express').Router();
const restaurantController = require('../controllers/restaurantController');
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken');

router.post('/', verifyTokenAndAuthorization, restaurantController.addRestaurant);
router.get('/random', restaurantController.getRandomRestaurants);
router.get('/all', restaurantController.getAllNearByRestaurants);
router.get('/byId/:id', restaurantController.getRestaurantById);

module.exports = router;
