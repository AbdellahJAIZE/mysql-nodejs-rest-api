
const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/brands');
const jwtauth       = require('../jwt-auth');



router.post('/addBrand', jwtauth, controller.addBrand);

router.patch('/updateBrand/:idBrand', jwtauth, controller.updateBrand);

router.delete('/deleteBrand/:idBrand', jwtauth, controller.deleteBrand);

router.get('/getBrand/:idBrand', jwtauth, controller.getBrand);






//router.get('/:idUser', controller.getUserWithAllInfo); 

module.exports =  router;

