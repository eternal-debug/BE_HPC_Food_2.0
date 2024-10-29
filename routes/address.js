const router = require('express').Router();
const addressController = require('../controllers/addressController');
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken');

router.post('/', verifyTokenAndAuthorization, addressController.addAddress);
router.get('/default', verifyTokenAndAuthorization, addressController.getDefaultAddress);
router.get('/all', verifyTokenAndAuthorization, addressController.getAddress);
router.delete('/:id', verifyTokenAndAuthorization, addressController.deleteAddress);
router.patch('/default/:id', verifyTokenAndAuthorization, addressController.setDefaultAddress);

module.exports = router;