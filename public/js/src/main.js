import { topicPageUtils } from './topicUtils.js';
import { messagePageUtils } from './messageUtils.js';
import { quill } from './quill.js';
import { userInfoUtils } from './userInfoUtils.js';
import { profile } from './profileUtils.js';
import { connexionUtils } from './connexionUtils.js';
import { formHandler } from './formHandler.js';
import { hamMenu } from './hamburger.js';

const app = {

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
  }
}

document.addEventListener('DOMContentLoaded', app.init);
