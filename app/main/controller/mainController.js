const mainViews = require('../views/mainViews');


const mainController = {

  // code associé à la route '/'
  index: (request, response) => { mainViews.index(request, response) },

  /**
   * Set the session' infos
   */
  checkSession: function(request, response, next) {

    if (!request.session.user) {
      request.session.user = {
        id: false,
        message: null
      }
      request.session.message = null
    }

    next();
  },

  sessionDisconnect: (request, response, next) => {

    request.session.user = {
      id: false,
      message: null
    };

    response.redirect('/');
  },


}

module.exports = mainController;
