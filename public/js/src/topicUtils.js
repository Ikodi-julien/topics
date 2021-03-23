import { formHandler } from './formHandler.js';
import { getCookie } from './getCookie.js';

export const topicPageUtils = {

  /**
   * Create an add topic elements in DOM
   * if topic comes from a form, topic.id and 
   * @param {Object} topic - Un des topics récup avec la catégorie
   */
  createTopic: async (topic) => {

    console.log(topic);
    const errors = [];

    try {
      // Récup du template :
      const template = document.getElementById('topicTemplate');
      // Clone du modèle
      const node = document.importNode(template.content, true);
      // On positionne les infos dans le modèle
      // id du topic
      node.querySelector('.topic').dataset.id = topic.id;

      // L'adresse du lien, il faut le nom de la catégorie
      // si le topic vient d'une catégorie, on a que l'id de la catégorie
      let catName;
      if (typeof topic.category === "number") { // On doit récup le nom de la cat

        const resCatName = await fetch(`http://localhost:1337/categories/${topic.category}`)

        if (!resCatName.ok) {

          errors.push({ resCatName: resCatName.statusText });
          return

        } else {
          const catNameJSON = await resCatName.json();
          catName = catNameJSON.name;
        }

      } else {
        // Sinon, c'est un nouveau topic on a l'info
        catName = topic.category.name;
      }

      const url = `/topics/${catName}/${topic.id}`;
      node.querySelector('.topicMessagesHref').href = url;

      // Nom de l'auteur, même problème que la catégorie
      let author;
      if (typeof topic.author === "number") { // On doit récup le nom de la cat

        const resAuthor = await fetch(`http://localhost:1337/users/${topic.author}`)

        if (!resAuthor.ok) {
          errors.push({ resAuthor: resAuthor.statusText });
          return

        } else {

          const authorJSON = await resAuthor.json();
          // console.log('authorJSON : ', authorJSON);
          author = authorJSON.username;
        }

      } else {
        author = topic.author.username;
      }

      node.querySelector('.topicAuthor').textContent = author;

      // console.log('author', author);
      // Date de création
      node.querySelector('.topicCreatedAt').textContent = new Date(topic.created_at).toLocaleDateString();

      // Nb de messages
      const resNbMessage = await fetch(`http://localhost:1337/topics/${topic.id}`)
      if (!resNbMessage.ok) {
        errors.push({ resNbMessage: resNbMessage.statusText });
      } else {
        const topicMessages = await resNbMessage.json();
        node.querySelector('.nbMessages').textContent = topicMessages.messages.length;
      }

      // Le titre
      node.querySelector('.topic__main__title').textContent = topic.title;

      // Description, il faut créer un éditeur Quill
      // Pour repérer l'éditeur on lui donne en param l'id du topic
      node.querySelector('.topic__main__description').id = `editor${topic.id}`;

      /*--- IF USER AUTHENTICATED ---*/

      if (getCookie('token')) {

        // Ajouter les boutons edit et delete dans le footer
        const footer = node.querySelector('.topic__footer .topic__button__row');

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('topic__button__control', 'edit__btn');
        deleteBtn.innerHTML = '<i class="far fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', topicPageUtils.deleteTopic);

        const editBtn = document.createElement('button');
        editBtn.classList.add('topic__button__control', 'delete__btn');
        editBtn.innerHTML = '<i class="far fa-edit"></i>';
        editBtn.addEventListener('click', topicPageUtils.updateTopic);

        footer.appendChild(deleteBtn);
        footer.appendChild(editBtn);
      }
      /*-------------------------------*/
      // ADD elt in DOM
      document.querySelector('.topics__container').appendChild(node);

      // On créé l'editeur
      const quill = new Quill(`#editor${topic.id}`, {});

      // Les données mise en forme sont stockées en format JSON,
      // c'est la propriété 'ops' pour les récupérer
      quill.setContents(
        topic.topic_content.ops,
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
  makeTopicList: async () => {

    if (document.getElementsByClassName('categorypage__main__container').length) {

      // On récup l'id' de la catégorie
      const catId = document.querySelector('#catId').textContent.toLowerCase();

      try {
        // On récupère la liste de topics pour cette catégorie
        const data = await fetch(`http://localhost:1337/categories/${catId}`);

        if (data.ok) {
          // On affiche un 'article' pour chaque topic
          const catTopics = await data.json();
          for (const topic of catTopics.topics) {

            topicPageUtils.createTopic(topic);
          }
        } else {
          throw (data.statusText);
        }

      } catch (error) {
        console.log('makeTopicList: ', error)
      }
    }
  },

  deleteTopic: async (event) => {

    const topic = event.target.closest('.topic');

    try {

      // Récupérer le token laissé au moment de la connexion
      const token = getCookie('token');

      if (!token) {

        alert("Vous n'avez pas les droits pour supprimer ce topic, désolé...");
        return
      }

      const authorization = `Bearer ${token}`;

      const response = await fetch(`http://localhost:1337/topics/${topic.dataset.id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": authorization
        }
      })

      if (response.ok) {

        document.querySelector('.topics__container').removeChild(topic);
        console.log('deleted');

      } else {
        throw (response.statusText)
      }

    } catch (error) {
      console.log(error);
    }
  },

  updateTopic: (event) => {
    // Récupérer le quill
    const editor = event.target.closest('.topic').querySelector('.ql-container');
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
    // console.log(Quill.find(editor) === quill); // Should be true

    // Ajouter un bouton valider et un quitter
    const topicBtnRow = event.target.closest('.topic__button__row');

    const validBtn = document.createElement('button');
    validBtn.classList.add('topic__button__control')
    validBtn.innerHTML = '<i class="far fa-check-circle"></i>';
    // PUT le nouveau message,
    validBtn.addEventListener('click', async (event) => {

      await formHandler.putTopic(event)

      // revenir à un quill sans rien
      event.target.closest('.topic').querySelector('.ql-toolbar').remove()
      editor.style.border = "none";
      quitBtn.remove();
      validBtn.remove();
      quill.disable();
    })

    const quitBtn = document.createElement('button');
    quitBtn.classList.add('topic__button__control')
    quitBtn.innerHTML = '<i class="far fa-times-circle"></i>';
    quitBtn.addEventListener('click', () => {
      // revenir à un quill sans rien
      event.target.closest('.topic').querySelector('.ql-toolbar').remove()
      editor.style.border = "none";
      quitBtn.remove();
      validBtn.remove();
      quill.disable();
    })

    topicBtnRow.appendChild(quitBtn);
    topicBtnRow.appendChild(validBtn);
  }
}
