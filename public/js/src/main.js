import { topicPageUtils } from './topicUtils.js';
import { messagePageUtils } from './messageUtils.js';
import { quill } from './quill.js';
import { userInfoUtils } from './userInfoUtils.js';
import { profile } from './profileUtils.js';
import { connexionUtils } from './connexionUtils.js';
import { formHandler } from './formHandler.js';
import { hamMenu } from './hamburger.js';

const app = {

  disconnectButton: document.getElementById('topicsDisconnect'),

  disconnect: () => {
    console.log('disconnect');
    // Supprime le cookie du navigateur
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
