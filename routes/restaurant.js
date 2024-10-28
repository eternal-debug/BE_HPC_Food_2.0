const router = require('express').Router();
const restaurantController = require('../controllers/RestaurantController');

router.post('/', restaurantController.addRestaurant);
router.get('/random', restaurantController.getRandomRestaurants);
router.get('/all', restaurantController.getAllNearByRestaurants);
router.get('/byId/:id', restaurantController.getRestaurantById);

module.exports = router;
