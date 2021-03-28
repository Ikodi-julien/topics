const mainViews = require('../views/mainViews');

const mainController = {
  // code associé à la route '/'
  index: (request, response) => {
    mainViews.index(request, response);
  },

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
  checkSession: function (request, response, next) {
    const user = [];
    // Si les paramètres de session par défaut n'existent pas,
    // On les crée
    if (!request.session.user) {
      request.session.user = {
        id: -1,
        token: '',
        message: '',
      };
      // Servira à une condition à l'affichage des messages,
      request.session.messageFirstDisplay = false;
      // Servira à une condition pour nouvelle session lors de l'inscription,
      request.session.connexionFirstRound = false;
    } else if (request.session.connexionFirstRound) {
      // Récup des données de session de l'utilisateur.
      user.push(request.session.user);
      // Je regenère une session pour éviter les problèmes d'identifiant lié à la session
      request.session.regenerate(error => {
        if (error) console.log('session regenerate error : ', error);
        console.log('New SID : ', request.sessionID);
        // On remet les données de session
        request.session.user = user[0];
        request.session.messageFirstDisplay = true;
        request.session.connexionFirstRound = false;
      });
    }

    next();
  },

  sessionDisconnect: (request, response, next) => {
    request.session = null;
    response.redirect('/');
  },
};

module.exports = mainController;
