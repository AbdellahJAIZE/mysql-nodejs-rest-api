
const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/categories');
const jwtauth       = require('../jwt-auth');

router.post('/addCategorie', jwtauth, controller.addCategorie);

router.patch('/updateCategorie/:idCategorie', jwtauth, controller.updateCategorie);

router.delete('/deleteCategorie/:idCategorie', jwtauth, controller.deleteCategorie);

router.get('/getCategorie/:idCategorie', jwtauth, controller.getCategorie);


module.exports =  router;

