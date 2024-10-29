const router = require('express').Router();
const cartController = require('../controllers/cartController');
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken');

router.post("/",verifyTokenAndAuthorization, cartController.addProductToCart);
router.get("/decrement/:id",verifyTokenAndAuthorization, cartController.decrementProductQuantity);
router.delete("/:id",verifyTokenAndAuthorization, cartController.removeCartItem);
router.get("/",verifyTokenAndAuthorization, cartController.getCart);
router.get("/count",verifyTokenAndAuthorization, cartController.getCartCount);

module.exports = router;