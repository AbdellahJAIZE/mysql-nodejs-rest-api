
const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/users');
const jwtauth       = require('../jwt-auth');


router.post('/signup', controller.userSignup);
router.post('/signin', controller.userSignin);
router.post('/setPersonalInfo/:idUser', jwtauth, controller.setPersonalInfo);
router.post('/addAdress', jwtauth, controller.addAdress);
router.post('/setShippingAdress/:idUser', jwtauth, controller.setShippingAdress);

router.patch('/updatePersonalInfo/:idUser', jwtauth, controller.updatePersonalInfo);
router.patch('/updateAdress/:idAdress', jwtauth, controller.updateAdress);
router.patch('/updateShippingAdress/:idShippingAdress', jwtauth, controller.updateShippingAdress);

router.get('/getPersonalInfo/:idUser', jwtauth, controller.getPersonalInfo);
router.get('/getUserAdress/:idUser', jwtauth, controller.getUserAdress);
router.get('/getShippingAdress/:idUser', jwtauth, controller.getShippingAdress);

router.delete('deleteAdress/:idAdress', jwtauth, controller.deleteAdress);
router.delete('deleteShippingAdress/:idShippingAdress', jwtauth, controller.deleteShippingAdress);
router.delete('deletePersonalInfo', jwtauth, controller.deletePersonalInfo);


//router.get('/:idUser', controller.getUserWithAllInfo); 

module.exports =  router;