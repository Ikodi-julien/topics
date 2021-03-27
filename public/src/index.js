import { topicPageUtils } from './js/topicUtils.js';
import { messagePageUtils } from './js/messageUtils.js';
import { quill } from './js/quill.js';
import { userInfoUtils } from './js/userInfoUtils.js';
import { profile } from './js/profileUtils.js';
import { connexionUtils } from './js/connexionUtils.js';
import { formHandler } from './js/formHandler.js';
import { hamMenu } from './js/hamburger.js';
import './css/style.css';

const app = {

  disconnectButton: document.getElementById('topicsDisconnect'),

  disconnect: () => {
    console.log('disconnect');
    // Supprime le cookie d'identification et de session du navigateur
    document.cookie = "token=true; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "topics.sid=true; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    /* Remarque : Si l'utilisateur ne fermez pas son navigateur et/ou ne se 
    deconnecte pas, les cookies restent en place */
    // La session sera réinitialisée à cette adresse
    location.href = '/connexion/disconnect';
  },

  init: () => {
    quill.makeForm();
    topicPageUtils.makeTopicList();
    messagePageUtils.populateTopic();
    messagePageUtils.makeMessageList();
    userInfoUtils.addListener();
    profile.addEventListener();
    connexionUtils.init();
    formHandler.init();
    hamMenu.addEventListener();

    if (app.disconnectButton !== null) {
      app.disconnectButton.addEventListener('click', app.disconnect)
    }
  }
}

document.addEventListener('DOMContentLoaded', app.init);
