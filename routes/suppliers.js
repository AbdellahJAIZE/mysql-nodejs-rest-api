
const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/suppliers');
const jwtauth       = require('../jwt-auth');

router.post('/addSupplier', jwtauth, controller.addSupplier);

router.patch('/updateSupplier/:idSupplier', jwtauth, controller.updateSupplier);

router.delete('/deleteSupplier/:idSupplier', jwtauth, controller.deleteSupplier);

router.get('/getSupplier/:idSupplier', jwtauth, controller.getSupplier);


module.exports =  router;

