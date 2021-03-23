const mainViews = require('../views/mainViews');

const mainController = {

  // code associé à la route '/'
  index: (request, response) => { mainViews.index(request, response) },

  /**
   * Set the session' infos
   * 
   * session = user : {
   *                  id: -1,
   *                  token: '',
   *                  message: '',
   *                },
   *           firstMessage: false 
   */
  checkSession: function(request, response, next) {

    const user = [];
    if (!request.session.user) {

      request.session.user = {
        id: -1,
        token: '',
        message: ''
      }
      request.session.messageFirstDisplay = false;
      request.session.connexionFirstRound = false;

    } else if (request.session.connexionFirstRound) {

      user.push(request.session.user);
      // Je regenère une session pour éviter les problèmes d'identifiant lié à la session
      request.session.regenerate((error) => {
        if (error) console.log('session regenerate error : ', error);
        console.log('SID', request.sessionID)

        request.session.user = user[0];
        request.session.messageFirstDisplay = true;
        request.session.connexionFirstRound = false;

      })
    }

    next();
  },

  sessionDisconnect: (request, response, next) => {

    request.session = null;
    response.redirect('/');
  },
}

module.exports = mainController;
