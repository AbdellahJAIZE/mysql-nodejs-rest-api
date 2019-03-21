
const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/orders');
const jwtauth       = require('../jwt-auth');

router.post('/addOrder', jwtauth, controller.addOrder);
router.post('/addProductToOrder', jwtauth, controller.addProductToOrder);


router.patch('/updateOrder/:idOrder', jwtauth, controller.updateOrder);
router.patch('/updateProductInOrder/:idOrderProduct', jwtauth, controller.updateProductInOrder);


router.delete('/deleteOrder/:idOrder', jwtauth, controller.deleteOrder);
router.delete('/deleteProductInOrder/:idOrderProduct', jwtauth, controller.deleteProductInOrder);


router.get('/getOrder/:idOrder', jwtauth, controller.getOrder);



module.exports =  router;

