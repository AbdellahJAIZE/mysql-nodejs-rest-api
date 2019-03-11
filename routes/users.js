
const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/users');
const jwtauth       = require('../jwt-auth');


router.get('/test', jwtauth, controller.withToken);
//router.get('', controller.getUsers);
//router.get('/:id', controller.getUser);
router.post('/signup', controller.userSignup);
router.post('/signin', controller.userSignin);

module.exports =  router;