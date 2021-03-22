import { formHandler } from './formHandler.js';
import { getCookie } from './getCookie.js';

export const messagePageUtils = {

  populateTopic: () => {
    // For messages page only, the topic.
    if (document.querySelectorAll('#mainTopicEditor').length) {
      // Récup du contenu à afficher, vient du serveur
      const content = document.getElementById('topicContent').innerText

      // On fait un quill pour garder la mise en forme
      const quill = new Quill('#mainTopicEditor', {});

      // quill prend un objet json pour définir son contenu
      const contentJson = JSON.parse(content);
      quill.setContents(contentJson);
      quill.disable();
    }
  },

  /**
   * Create an add topic elements in DOM
   * @param {Object} topic - Un des topics récup avec la catégorie
   */
  createMessage: async (message) => {

    /************ LES VARIABLES !!!!************/
    const errors = [];
    let author, catName;

    // Récup du template :
    const template = document.getElementById('messageTemplate');

    /************ POPULATE ************/
    // Clone du modèle
    const node = document.importNode(template.content, true);
    // On positionne les infos dans le modèle
    // id du topic
    node.querySelector('.message').dataset.id = message.id;

    try {
      // Nom de l'auteur, même problème que la catégorie
      if (typeof message.users_permissions_user === "number") {

        const resAuthor = await fetch(`http://localhost:1337/users/${message.users_permissions_user}`)

        if (!resAuthor.ok) {
          errors.push({ resAuthor: resAuthor.statusText });
          return

        } else {
          const authorJSON = await resAuthor.json();
          author = authorJSON.username;
        }

      } else {
        author = message.users_permissions_user;
      }

      node.querySelector('.message__header__author').textContent = author;

      // Date de création
      node.querySelector('#messageCreatedAt').textContent = new Date(message.created_at).toLocaleDateString();

      // Description, il faut créer un éditeur Quill
      // Pour repérer l'éditeur on lui donne en param l'id du message
      node.querySelector('.message__main__description').id = `editor${message.id}`;

      /*********** BUTTONS IF CONNECTED ***********/

      if (getCookie.get('token')) {

        // Ajouter les boutons edit et delete dans le footer
        const footer = node.querySelector('.message__footer');

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('message__button__control', 'delete__btn');
        deleteBtn.innerHTML = '<i class="far fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', messagePageUtils.deleteMessage);

        const editBtn = document.createElement('button');
        editBtn.classList.add('message__button__control', 'edit__btn');
        editBtn.innerHTML = '<i class="far fa-edit"></i>';
        editBtn.addEventListener('click', messagePageUtils.updateMessage);

        footer.appendChild(deleteBtn);
        footer.appendChild(editBtn);
      }
      /********************************************/

      // ADD elt in DOM
      document.querySelector('.message__list').appendChild(node);

      /************** QUILL ****************** */

      // On créé l'editeur
      const quill = new Quill(`#editor${message.id}`, {});

      // Les données mise en forme sont stockées en format JSON,
      // c'est la propriété 'ops' pour les récupérer
      quill.setContents(
        message.message_content.ops,
        'api'
      );
      // Il n'est pas possible pour l'instant d'éditer le topic
      quill.enable(false);

      if (!errors.length) {
        return true;
      } else {
        throw new Error(JSON.stringify(errors));
      }

    } catch (error) {
      console.log('createQuill catch :', error);
    }
  },

  /**
   * When loading a topic page, creates the topics related to a category
   */
  makeMessageList: async () => {

    if (document.getElementsByClassName('messagesPage__mainContainer').length) {

      // On récupère l'id du topic
      const topicId = document.querySelector('#topicId').textContent.toLowerCase();
      // On récupère la liste des messages pour ce topic
      try {

        const data = await fetch(`http://localhost:1337/topics/${topicId}`);

        if (data.ok) {

          const topic = await data.json();
          // On affiche un 'article' pour chaque message
          for (const message of topic.messages) {
            // console.log(message.message_content);
            messagePageUtils.createMessage(message);
          }
        } else {
          throw new Error(data.statusText);
        }

      } catch (error) {
        console.log('makemessage :', error)
      }
    }
  },

  deleteMessage: async (event) => {

    const message = event.target.closest('.message');

    try {
      const response = await fetch(`http://localhost:1337/messages/${message.dataset.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {

        document.querySelector('.message__list').removeChild(message);
        console.log('deleted');

      } else {
        console.log(response.statusText)
      }

    } catch (error) {
      console.log(error.stack);
    }
  },

  updateMessage: (event) => {
    // Récupérer le quill
    const editor = event.target.closest('.message').querySelector('.ql-container');
    var quill = new Quill(editor, {
      "toolbar": {
        "container": [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'color': [] }, { 'background': [] }],
              ['emoji'],
            ],
        "handlers": {
          'emoji': function() {}
        }
      },
      "emoji-toolbar": true,
      "emoji-textarea": true,
      "emoji-shortname": true,
      "theme": 'snow'
    });

    // Le rendre editable
    quill.enable();
    console.log(Quill.find(editor) === quill); // Should be true

    // Ajouter un bouton valider et un quitter
    const messageFooter = event.target.closest('.message__footer');

    const validBtn = document.createElement('button');
    validBtn.classList.add('message__button__control')
    validBtn.innerHTML = '<i class="far fa-check-circle"></i>';

    // PUT le nouveau message,
    validBtn.addEventListener('click', async (event) => {

      let isInAPI = await formHandler.putMessage(event)
      if (!isInAPI) {
        console.log('putMessage...Problème');
        return
      }
      // revenir à un quill sans rien
      event.target.closest('.message').querySelector('.ql-toolbar').remove()
      editor.style.border = "none";
      quitBtn.remove();
      validBtn.remove();
      quill.disable();
    })


    const quitBtn = document.createElement('button');
    quitBtn.classList.add('message__button__control')
    quitBtn.innerHTML = '<i class="far fa-times-circle"></i>';
    quitBtn.addEventListener('click', () => {
      // revenir à un quill sans rien
      event.target.closest('.message').querySelector('.ql-toolbar').remove()
      editor.style.border = "none";
      quitBtn.remove();
      validBtn.remove();
      quill.disable();
    })

    messageFooter.appendChild(quitBtn);
    messageFooter.appendChild(validBtn);

  }
}
