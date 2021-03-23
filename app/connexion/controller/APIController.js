const googleTools = require('./../MW/googleTools');
const githubTools = require('./../MW/githubTools');
const connexionDB = require('./../model/connexionDB');
const connexionController = require('../controller/connexionController');
const connexionViews = require('../view/connexionViews');
const strapi = require('../../strapi/strapi');
const { raw } = require('express');

const APIController = {

  /**
   * After a user is identified, retrieve infos from google redirect url <code>
   * @param {Objet} request 
   * @param {Objet} response 
   */
  google: async (request, response) => {

    try {
      const dataGoogle = await googleTools.getGoogleAccountFromCode(request.query.code);

      if (dataGoogle) {
        const body = {
          identifier: dataGoogle.email,
          password: dataGoogle.password,
        }
        // console.log(body);
        // Tentative de log in
        const dataUser = await strapi.logUser(JSON.stringify(body));
        // console.log(dataUser);

        if (dataUser.statusCode !== 400) { //

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

        } else {
          // Ici requête d'inscription
          await connexionController.APICreateAccountControl(dataGoogle, request, response);
          return
        }

      } else {
        response.redirect('/connexion/stdLogin?msg_code=EC001');
      }

    } catch (error) {
      console.log(error)
      response.redirect('/connexion/stdLogin?msg_code=EC010');
    }
  },

  github: async (request, response) => {

    // console.log('github')
    try {

      const accessToken = await githubTools.getAccessTokenFromGithub(request, response)
      const dataGithub = await githubTools.getUserFromToken(accessToken);

      // console.log(dataUser)
      if (dataGithub) {
        const body = {
          identifier: dataGithub.email,
          password: dataGithub.password,
        }
        // console.log(body);
        // Tentative de log in
        const dataUser = await strapi.logUser(JSON.stringify(body));
        // console.log(dataUser);

        if (dataUser.statusCode !== 400) { //

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

        } else {
          // Ici requête d'inscription
          await connexionController.APICreateAccountControl(dataGoogle, request, response);
          return
        }

      } else {
        response.redirect('/connexion/stdLogin?msg_code=EC001');
      }

    } catch (error) {
      console.log(error)
      response.redirect('/connexion/stdLogin?msg_code=EC010');
    }
  },

  manageStrapi: (dataUser, request, response) => {
    // Ici on vérifie si l'utilisateur existe en DBUser

    connexionDB.getUserByEmail(dataUser.email, (err, res) => {

      if (err) { // Erreur dans la requête SELECT
        console.log(err)
        response.redirect('/connexion/stdLogin?msg_code=FC000');

      } else if (res.rows.length) {

        request.session.data.logguedIn = true;
        request.session.data.userInfos = res.rows[0];
        console.log(res.rows[0]);

        response.redirect('/categories?msg_code=IC000');

      } else {

        connexionDB.insertProfil(dataUser, (err, res) => {

          if (err) { // Erreur requête INSERT INTO
            console.log(err)
            response.redirect('/?msg_code=FC000')

          } else {
            // console.log('result', res);

            // ici mettre les valeurs d'identification dans la session
            request.session.data.logguedIn = true;
            request.session.data.userInfos = {
              id: res.rows[0].id,
              status: res.rows[0].status,
              pseudo: res.rows[0].pseudo
            }

            response.redirect('/categories?msg_code=IC000');
          }
        })
      }
    })
  }
}

module.exports = APIController;
