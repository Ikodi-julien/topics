const connexionViews = require('../view/connexionViews');
const strapi = require('../../strapi/strapi');
const { githubURL } = require('../MW/githubTools');
const { url } = require('../MW/googleTools');
const bcrypt = require('bcrypt');

const connexionController = {
  /*-------------- VIEWS ----------------*/

  stdConnexion: (request, response) => {
    response.locals.urlGoogle = url;
    response.locals.urlGithub = githubURL;

    connexionViews.view(request, response);
  },

  createAccount: (request, response) => {
    connexionViews.view(request, response);
  },
  lostPass: (request, response) => {
    connexionViews.view(request, response);
  },
  deleteUser: (request, response) => {
    connexionViews.view(request, response);
  },

  /*-------------- FORM CONTROL ------------*/

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
        response.redirect('/connexion/stdLogin');
      }
    } catch (error) {
      request.params.view = 'stdLogin';
      request.session.user.message = error.stack;
      console.log('finalLoginCtrl : ', error);
      connexionViews.view(request, response);
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
      password_2: request.body.password_2,
    };

    // Check empty form
    if (
      form.firstname === '' ||
      form.lastname === '' ||
      form.email === '' ||
      form.password_1 === ''
    ) {
      response.redirect('/connexion/stdLogin?msg_code=IC1000');
      return;
    }

    if (form.password_1 !== form.password_2) {
      // Passwords check
      response.redirect('/connexion/stdLogin?msg_code=IC111');
      return;
    }

    // Le formulaire est ok, on fait une demande de register à strapi
    const body = {
      username: form.firstname + '-' + form.lastname,
      email: form.email,
      password: form.password_1,
      firstname: form.firstname,
      lastname: form.lastname,
    };

    try {
      const newUser = await strapi.registerUser(body);

      // On gère les infos ou error
      if (
        typeof newUser.error !== 'undefined' ||
        typeof newUser.message !== 'undefined'
      ) {
        // Ici on fixe la vue à afficher lors du render
        request.params.view = 'stdLogin';
        request.session.user.message = newUser.error || newUser.message;
        console.log('newUser error : ', newUser.error);
        console.log('newUser message : ', newUser.message);
        connexionViews.view(request, response);
        return;
      }

      // // On crée un token d'identification
      const tokenBody = {
        token: form.password_1,
        user: newUser.user.id,
      };
      // console.log('tokenbody :', tokenBody);

      // On l'envoi à l'API
      const rawToken = await strapi.setToken(tokenBody);

      // On gère les infos ou error
      if (
        typeof rawToken.error !== 'undefined' ||
        typeof rawToken.message !== 'undefined'
      ) {
        // Ici on fixe la vue à afficher lors du render
        request.params.view = 'stdLogin';
        request.session.user.message = newUser.error || newUser.message;
        console.log('newUser error : ', newUser.error);
        console.log('newUser message : ', newUser.message);
        connexionViews.view(request, response);
        return;
      }

      // Demande connexion à l'API
      connexionController.finalLoginCtrl(
        JSON.stringify({
          identifier: body.email,
          password: body.password,
        }),
        request,
        response
      );
    } catch (error) {
      console.log(error);
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
      lastname: dataAPI.lastName,
    };

    // console.log(body);
    try {
      const newUser = await strapi.registerUser(body);

      // On gère les infos ou error
      if (
        typeof newUser.error !== 'undefined' ||
        typeof newUser.message !== 'undefined'
      ) {
        // Ici on fixe la vue à afficher lors du render
        request.params.view = 'stdLogin';
        request.session.user.message = newUser.error || newUser.message;
        console.log('newUser error : ', newUser.error);
        console.log('newUser message : ', newUser.message);
        connexionViews.view(request, response);
        return;
      }

      // On crée un token d'identification
      const tokenBody = {
        token: newUser.user.email + 'topicsQ',
        user: newUser.user.id,
      };
      // console.log('tokenbody :', tokenBody);

      // On l'envoi à l'API
      const rawToken = await strapi.setToken(tokenBody);

      // On gère les infos ou error
      if (
        typeof rawToken.error !== 'undefined' ||
        typeof rawToken.message !== 'undefined'
      ) {
        // Ici on fixe la vue à afficher lors du render
        request.params.view = 'stdLogin';
        request.session.user.message = newUser.error || newUser.message;
        console.log('newUser error : ', newUser.error);
        console.log('newUser message : ', newUser.message);
        connexionViews.view(request, response);
        return;
      }

      // Demande connexion à l'API
      connexionController.finalLoginCtrl(
        JSON.stringify({
          identifier: body.email,
          password: body.password,
        }),
        request,
        response
      );
    } catch (error) {
      console.log(error);
      request.params.view = 'stdLogin';
      // request.session.user.message = newUser.error || newUser.message;
      // console.log('newUser error : ', newUser.error);
      // console.log('newUser message : ', newUser.message);
      connexionViews.view(request, response);
    }
  },
};

module.exports = connexionController;
