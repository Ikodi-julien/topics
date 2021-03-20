import { messagePageUtils } from './messageUtils.js';
import { quill } from './quill.js';
import { topicPageUtils } from './topicUtils.js';


export const formHandler = {

  init: () => {
    formHandler.addEventListener();
  },

  topicForm: document.getElementsByClassName('topic__form')[0],
  messageForm: document.getElementsByClassName('message__form')[0],

  addEventListener: () => {

    console.log(typeof formHandler.topicForm);
    console.log(typeof formHandler.messageForm);

    if (typeof formHandler.topicForm !== 'undefined') {
      formHandler.topicForm.addEventListener('submit', formHandler.postTopic);
    }
    if (typeof formHandler.messageForm !== 'undefined') {
      formHandler.messageForm.addEventListener('submit', formHandler.postMessage);
    }
  },

  postTopic: async (event) => {

    event.preventDefault();

    // Récupération du formulaire, du titre, de l'url, de la cat id et user id :
    const form = event.target;
    const url = form.dataset.action;
    const topicTitle = form.querySelector('input[name="topic__title"]').value;
    const catId = document.querySelector('#catId').textContent;
    const userId = document.querySelector('#infoUserId').textContent;

    // Récupération du contenu html du champ de saisie
    const quillContent = quill.newQuill.getContents();

    const body = JSON.stringify({

      title: topicTitle,
      topic_content: quillContent,
      category: catId,
      users_permissions_user: userId
    })
    // console.log(body);

    try {
      const response = await fetch(`http://localhost:1337${url}`, {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body
      });

      const topic = await response.json();
      // console.log(topic);
      if (response.ok) {
        const isCreated = await topicPageUtils.createTopic(topic)

        if (isCreated) {
          form.querySelector('input[name="topic__title"]').value = '';
          quill.newQuill.setContents('');
        }
      } else {
        console.log(response.statusText);
      }

    } catch (error) {
      console.error(error);
    }
  },

  postMessage: async (event) => {

    event.preventDefault();

    // Récupération du formulaire et user id :
    const topicId = document.querySelector('#topicId').textContent;
    const userId = document.querySelector('#infoUserId').textContent;

    // Récupération du contenu html du champ de saisie
    const quillContent = quill.newQuill.getContents();

    // Prépa des données à envoyer
    const body = JSON.stringify({

      topic: topicId,
      message_content: quillContent,
      users_permissions_user: userId
    })
    console.log(body);

    try {
      const response = await fetch(`http://localhost:1337/messages`, {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body
      });

      if (response.ok) {

        const message = await response.json();
        // console.log(topic);
        const isCreated = await messagePageUtils.createMessage(message)

        if (isCreated) {
          quill.newQuill.setContents('');
        }
      } else {
        console.log(response.statusText);
      }

    } catch (error) {
      console.error(error);
    }
  },

  putMessage: async (event) => {

    // Récupération de l'id du message :
    const messageId = event.target.closest('.message').dataset.id;

    // Récupération du contenu du message
    const editor = event.target.closest('.message').querySelector('.ql-container');

    const quill = new Quill(editor);
    const content = quill.getContents();

    // Prépa des données à envoyer
    const body = JSON.stringify({

      message_content: content,
    })
    console.log(body);

    try {
      const response = await fetch(`http://localhost:1337/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          "content-type": "application/json"
        },
        body
      });

      if (response.ok) {
        return true;
      } else {
        throw (response.statusText);
      }

    } catch (error) {
      console.error(error);
    }
  },

  putTopic: async (event) => {

    // Récupération de l'id du topic :
    const topicId = event.target.closest('.topic').dataset.id;

    // Récupération du contenu du topic
    const editor = event.target.closest('.topic').querySelector('.ql-container');

    const quill = new Quill(editor);
    const content = quill.getContents();

    // Prépa des données à envoyer
    const body = JSON.stringify({

      topic_content: content,
    })
    console.log(body);

    try {
      const response = await fetch(`http://localhost:1337/topics/${topicId}`, {
        method: 'PUT',
        headers: {
          "content-type": "application/json"
        },
        body
      });

      if (response.ok) {
        return true;
      } else {
        throw (response.statusText);
      }

    } catch (error) {
      console.error(error);
    }
  },
}
