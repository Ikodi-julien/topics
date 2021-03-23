const connexionViews = require('../view/connexionViews');
const connexionDB = require('../model/connexionDB');
const bcrypt = require('bcrypt');
const generatePassword = require('generate-password');
const nodemailer = require('./../MW/nodemailer');
const strapi = require('../../strapi/strapi');
const { githubURL } = require('../MW/githubTools');
const { url } = require('../MW/googleTools');


const connexionController = {

  /*-------------- VIEWS ----------------*/

  stdConnexion: (request, response) => {
    response.locals.urlGoogle = url;
    response.locals.urlGithub = githubURL;

    connexionViews.view(request, response)
  },

  createAccount: (request, response) => { connexionViews.view(request, response); },
  lostPass: (request, response) => { connexionViews.view(request, response); },
  deleteUser: (request, response) => { connexionViews.view(request, response); },

  /*-------------- FORM CONTROL ------------*/
  /**
   * Controls wether the user informations matches usersDatabase
   */
  formLoginControl: async (request, response) => {

    // On prépare la requête API pour un token d'identité
    const body = JSON.stringify({
      identifier: request.body.email,
      password: request.body.password
    })

    connexionController.finalLoginCtrl(body, request, response);
  },

  /**
   * Function for stdLogin, googlelogin, github login...
   * @param {*} body 
   */
  finalLoginCtrl: async (body, request, response) => {
    try {
      // Demande connexion à l'API
      const dataUser = await strapi.logUser(body);
      // console.log(dataUser);

      if (typeof dataUser.jwt !== 'undefined') {
        // console.log('user :', dataUser);
        // dire de reinitialiser la session pour éviter les soucis de cookie
        request.session.first = true;
        // ici mettre les valeurs d'identification dans la session
        request.session.user = dataUser.user;
        response.cookie('token', dataUser.jwt);
        request.session.user.message = 'Ok connecté !';

        response.redirect('/categories?msg_code=IC000');

      } else {
        request.session.user.message = dataUser.data[0].messages[0].message;
        response.redirect('/connexion/stdLogin')

      }
    } catch (error) {
      request.params.view = 'stdLogin';
      request.session.user.message = error.stack;
      console.log('finalLoginCtrl : ', error);
      connexionViews.view(request, response)
    }
  },

  /**
   * Controls if form's data are good enought to create an account...
   */
  formCreateAccountControl: async (request, response) => {
    // On récupère les données à contrôler :
    const form = {
      firstname: request.body.first_name,
      lastname: request.body.last_name,
      email: request.body.email,
      password_1: request.body.password_1,
      password_2: request.body.password_2
    }

    // Check empty form
    if (
      form.firstname === '' ||
      form.lastname === '' ||
      form.email === '' ||
      form.password_1 === ''
    ) {
      response.redirect('/connexion/stdLogin?msg_code=IC1000');
      return
    }

    if (form.password_1 !== form.password_2) { // Passwords check
      response.redirect('/connexion/stdLogin?msg_code=IC111')
      return
    }

    // Le formulaire est ok, on fait une demande de register à strapi
    const body = {
      username: form.firstname + '-' + form.lastname,
      email: form.email,
      password: form.password_1,
      firstname: form.firstname,
      lastname: form.lastname
    }

    try {
      const newUser = await strapi.registerUser(body);

      // On gère les infos ou error
      if (typeof newUser.error !== 'undefined' || typeof newUser.message !== 'undefined') {
        // Ici on fixe la vue à afficher lors du render
        request.params.view = 'stdLogin';
        request.session.user.message = newUser.error || newUser.message;
        console.log('newUser error : ', newUser.error);
        console.log('newUser message : ', newUser.message);
        connexionViews.view(request, response);
        return
      }

      // On crée un token d'identification
      const tokenBody = {
        token: newUser.user.email + 'topicsQ',
        user: newUser.user.id
      }
      // console.log('tokenbody :', tokenBody);

      // On l'envoi à l'API
      const rawToken = await strapi.setToken(tokenBody);

      // On gère les infos ou error
      if (typeof rawToken.error !== 'undefined' || typeof rawToken.message !== 'undefined') {
        // Ici on fixe la vue à afficher lors du render
        request.params.view = 'stdLogin';
        request.session.user.message = newUser.error || newUser.message;
        console.log('newUser error : ', newUser.error);
        console.log('newUser message : ', newUser.message);
        connexionViews.view(request, response);
        return
      }

      // Demande connexion à l'API
      connexionController.finalLoginCtrl(JSON.stringify({
        identifier: body.email,
        password: body.password
      }), request, response);

    } catch (error) {
      console.log(error)
      request.params.view = 'stdLogin';
      connexionViews.view(request, response);
    }
  },


  /**
   * Controls if API's data are good enought to create an account...
   */
  APICreateAccountControl: async (dataAPI, request, response) => {
    //on fait une demande de register à strapi
    const body = {
      username: dataAPI.pseudo,
      email: dataAPI.email,
      password: dataAPI.password,
      firstname: dataAPI.firstName,
      lastname: dataAPI.lastName
    }

    // console.log(body);
    try {
      const newUser = await strapi.registerUser(body);

      // On gère les infos ou error
      if (typeof newUser.error !== 'undefined' || typeof newUser.message !== 'undefined') {
        // Ici on fixe la vue à afficher lors du render
        request.params.view = 'stdLogin';
        request.session.user.message = newUser.error || newUser.message;
        console.log('newUser error : ', newUser.error);
        console.log('newUser message : ', newUser.message);
        connexionViews.view(request, response);
        return
      }

      // On crée un token d'identification
      const tokenBody = {
        token: newUser.user.email + 'topicsQ',
        user: newUser.user.id
      }
      // console.log('tokenbody :', tokenBody);

      // On l'envoi à l'API
      const rawToken = await strapi.setToken(tokenBody);

      // On gère les infos ou error
      if (typeof rawToken.error !== 'undefined' || typeof rawToken.message !== 'undefined') {
        // Ici on fixe la vue à afficher lors du render
        request.params.view = 'stdLogin';
        request.session.user.message = newUser.error || newUser.message;
        console.log('newUser error : ', newUser.error);
        console.log('newUser message : ', newUser.message);
        connexionViews.view(request, response);
        return
      }

      // Demande connexion à l'API
      connexionController.finalLoginCtrl(JSON.stringify({
        identifier: body.email,
        password: body.password
      }), request, response);

    } catch (error) {
      console.log(error);
      request.params.view = 'stdLogin';
      // request.session.user.message = newUser.error || newUser.message;
      // console.log('newUser error : ', newUser.error);
      // console.log('newUser message : ', newUser.message);
      connexionViews.view(request, response);
    }
  },


  /**
   * Performs checkings over lost password request
   */
  lostPasswordControl: (request, response) => {

    // Récup du formulaire
    const email = request.body.email;

    // Ici vérifier que l'email est en base de données
    connexionDB.isEmailInDB(email, (error, data) => {

      if (error) {
        console.log('dans lostPassWordControl - isEmailInDB :', error);
        response.redirect('/connexion/stdLogin?msg_code=FC000');

      } else {

        if (data.rowCount) {
          // console.log('isEmailInDB : ', data);
          // Stocker les données utilisateur
          const user = data.rows[0];

          // Générer un nouveau mot de passe
          const newPassword = generatePassword.generate({
            length: 8,
            numbers: true,
          })

          // Le crypter avant de le mettre en DB
          // Le mettre en DB
          const insertData = {
            id: user.id,
            hashedPassword: bcrypt.hashSync(newPassword, 10)
          }

          connexionDB.insertDefaultPassword(insertData, (error, results) => {

            if (error) {

              console.log('dans lostPassWordControl - insertDefaultPassword :', error);
              response.redirect('/connexion/stdLogin?msg_code=FC000');

            } else {

              user.password = newPassword;

              // Sendmail personnifie le message envoyé
              nodemailer.sendLostPassMail(user, (error, info) => {

                if (error) {
                  console.log(error);
                  response.redirect('/connexion/stdLogin?msg_code=FC011');

                } else {
                  // console.log('results de insertDefaultPassword:', info.response);
                  response.redirect('/connexion/stdLogin?msg_code=IC011');
                }
              })
            }
          })
        } else {
          response.redirect('/connexion/stdLogin?msg_code=IC100')
        }
      }
    })
  },

  /**
   * Supprime un user de la BDD
   */
  deleteUserControl: (request, response) => {

    connexionDB.deleteUser(request.body.id, (error, results) => {

      if (error) {

        console.log('dans deleteUser :', error);
        response.redirect('/connexion/stdLogin?msg_code=FC000');

      } else {

        response.redirect('/connexion/stdLogin?msg_code=IC101');
      }
    })
  },

  //TODO................................................................
  /**
   * When a user responds to a "reinitialize password email", 
   * we have to make sure that everything is under control
   * @param {*} request 
   * @param {*} response 
   */
  checkDataMail: (request, response) => {

    // Ascertain code

    // if code ok set session détails

    // redirect to profile in order to set a new password


  }
}

module.exports = connexionController;
