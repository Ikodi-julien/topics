const googleTools = require('./../MW/googleTools');
const githubTools = require('./../MW/githubTools');
const connexionDB = require('./../model/connexionDB');
const connexionController = require('../controller/connexionController');
const connexionViews = require('../view/connexionViews');

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
        // Ici requête d'inscription
        const newUser = await connexionController.APICreateAccountControl(dataGoogle);

        // Si reponse avec un message, on tente de se connecter
        if (newUser.message) {

          console.log('newUser.message', newUser.message);
          const body = JSON.stringify({ identifier: dataGoogle.email, password: dataGoogle.password });
          connexionController.finalLoginCtrl(body, request, response);
          // ici après c'est finalLoginCtrl qui gère...

        } else {
          // c bon !
          request.session.user = newUser.user;
          console.log(newUser)
          request.session.user.token = newUser.jwt;
          request.session.user.message = 'Ok inscrit !';
          response.redirect('/categories');
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
      const dataUser = await githubTools.getUserFromToken(accessToken);

      // console.log(dataUser)
      if (dataUser) {
        // Ici requête d'inscription
        const newUser = await connexionController.APICreateAccountControl(dataUser);

        // Si reponse avec un message, on tente de se connecter
        if (newUser.message) {

          console.log('newUser.message', newUser.message);
          const body = JSON.stringify({ identifier: dataUser.email, password: dataUser.password });
          connexionController.finalLoginCtrl(body, request, response);
          // ici après c'est finalLoginCtrl qui gère...

        } else {
          // c bon !
          request.session.user = newUser.user;
          console.log(newUser)
          request.session.user.token = newUser.jwt;
          request.session.user.message = 'Ok inscrit !';
          response.redirect('/categories');
        }

      } else {
        response.redirect('/connexion/stdLogin?msg_code=EC001');
      }

    } catch (error) {
      console.log(error)
      response.redirect('/connexion/stdLogin?msg_code=EC100');
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
