const express = require('express');
const path = require('path');

// import database functionality

const mainController = require('./main/controller/mainController');
const connexionSwitch = require('./connexion/MW/connexionSwitch');
const forumController = require('./forum/controller/controller');
const getMessage = require('./main/MW/getMessage');

const router = express.Router();

/*------------ GET REQUESTS --------------*/

router.use(mainController.checkSession);

// FORUM
router.get('/', getMessage, mainController.index);
router.get('/categories', getMessage, forumController.categories);
router.get('/categories/:name', getMessage, forumController.category);
router.get('/topics/:catname/:id', getMessage, forumController.topic);


// CONNEXION
router.get('/connexion/:view', getMessage, connexionSwitch.GET);

/*------------ POST REQUESTS --------------*/

// CONNEXION
router.post('/postConnexion/:view', connexionSwitch.POST);

/*--------------------------------------------*/
module.exports = router;
