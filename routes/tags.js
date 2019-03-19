
const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/tags');
const jwtauth       = require('../jwt-auth');

router.post('/addTag', jwtauth, controller.addTag);

router.patch('/updateTag/:idTag', jwtauth, controller.updateTag);

router.delete('/deleteTag/:idTag', jwtauth, controller.deleteTag);

router.get('/getTag/:idTag', jwtauth, controller.getTag);


module.exports =  router;

