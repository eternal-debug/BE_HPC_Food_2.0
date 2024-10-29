const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken');

router.post('/', verifyTokenAndAuthorization, orderController.placeOrder);
router.get('/', verifyTokenAndAuthorization, orderController.getUserOrder);

module.exports = router;