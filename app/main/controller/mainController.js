const mainViews = require('../views/mainViews');

const mainController = {

  // code associé à la route '/'
  index: (request, response) => { mainViews.index(request, response) },

  /**
   * Set the session' infos
   * 
   * session.user : {
   *                  id: -1,
   *                  token: '',
   *                  message: ''
   *                },
   */
  checkSession: function(request, response, next) {

    const user = [];
    if (!request.session.user) {
      request.session.user = {
        id: -1,
        token: '',
        message: ''
      }
      request.session.first = false

    } else if (request.session.first) {

      user.push(request.session.user);
      // Je regenère une session pour éviter les problèmes d'identifiant lié à la session
      request.session.regenerate((error) => {
        if (error) console.log('session regenerate error : ', error);
        console.log('SID', request.sessionID)
        request.session.user = user[0];
        request.session.first = false;
      })
    }
    // console.log('final', request.session)

    next();
  },

  sessionDisconnect: (request, response, next) => {

    request.session = null;
    response.redirect('/');
  },
}

module.exports = mainController;
