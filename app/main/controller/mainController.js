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


    if (!request.session.user) {
      request.session.user = {
        id: -1,
        token: '',
        message: ''
      }

    }

    next();
  },

  sessionDisconnect: (request, response, next) => {

    request.session.user = {
      id: -1,
      token: '',
      message: ''
    }

    response.redirect('/');
  },
}

module.exports = mainController;
