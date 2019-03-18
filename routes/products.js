
const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/products');
const jwtauth       = require('../jwt-auth');



router.post('/addProduct', jwtauth, controller.addProduct);

router.patch('/updateProduct/:idProduct', jwtauth, controller.updateProduct);

router.delete('/deleteProduct/:idProduct', jwtauth, controller.deleteProduct);

router.get('/:idProduct', jwtauth, controller.getProduct);






//router.get('/:idUser', controller.getUserWithAllInfo); 

module.exports =  router;

