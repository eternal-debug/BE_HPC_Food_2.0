const router = require('express').Router();
const foodController = require('../controllers/foodController');
const { verifyVendor } = require('../middlewares/verifyToken');

router.post('/', verifyVendor, foodController.addFood);
router.get('/all', foodController.getAllFood);
router.get('/all-by-time', foodController.getAllFoodsSortedByTime);
router.get('/recommendation', foodController.getRandomFood);  
router.get('/restaurant-food/:id', foodController.getFoodByRestaurant);
router.get('/category/:category', foodController.getFoodByCategory);
router.get('/search/:search', foodController.searchFood);
router.get('/random/:category', foodController.getRandomFoodByCategory);
router.get('/byId/:id', foodController.getFoodById); 

module.exports = router;
