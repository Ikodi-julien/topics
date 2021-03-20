const client = require('../../client');

const forumDB = {

  // thanks to closure, i manage to pass arguments to the client.query callback
  promiseCB: function(resolve, reject) {
    return (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    }
  },

  /*
   **  READ QUERIES
   */

  getCategories: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * from public.categories`;

      client.query(query, forumDB.promiseCB(resolve, reject));
    })
  },

  getCategoryIdByName: (categoryName) => {
    return new Promise((resolve, reject) => {

      const query = `SELECT id from public.categories WHERE name=$1`;

      client.query(query, [categoryName], forumDB.promiseCB(resolve, reject));
    });
  },

  /**
   * Gets Topics and its messages from a catégory id
   * @param {int} categoryId 
   * @returns 
   */
  getTopicsByCategoryId: (categoryId) => {
    return new Promise((resolve, reject) => {

      const query = `
      SELECT public.topics.*, public."users-permissions_user".username, public.messages.topic, count(public.messages.topic) AS nb_message
      FROM public.topics
      JOIN public."users-permissions_user"
      ON public.topics."users_permissions_user" = public."users-permissions_user".id
      LEFT JOIN public.messages ON public.messages.topic = public.topics.id
      WHERE category = $1
      GROUP BY public.topics.id, public."users-permissions_user".username, public.messages.topic
      ORDER BY public.topics.created_at ASC;
      `;

      client.query(query, [+categoryId], forumDB.promiseCB(resolve, reject));
    });

  },

  // TEST ALL MESSAGES
  // this function query makes sure that a particular topic exists in this particular category 
  getTopicInCategory: (topicId, catName) => {
    return new Promise((resolve, reject) => {

      const query = `
      SELECT t.id, t.title, t.category, t.topic_content, t.created_at, u.username
      FROM public.topics as t
      JOIN public.categories as c
      ON t.category=c.id
      LEFT JOIN public."users-permissions_user" as u
      ON t.users_permissions_user=u.id
      WHERE c.name=$1 
      AND t.id=$2;
      `;

      client.query(query, [catName, +topicId], forumDB.promiseCB(resolve, reject));
    });
  },

  getAllMessagesByTopicId: (topicId) => {
    return new Promise((resolve, reject) => {

      const query = `
        SELECT public.messages.*, public."users-permissions_user".username
        FROM public.messages
        JOIN public."users-permissions_user" ON messages.users_permissions_user=public."users-permissions_user".id
        WHERE messages.topic=$1 ORDER BY messages.created_at ASC;
        `;

      client.query(query, [+topicId], forumDB.promiseCB(resolve, reject));
    });
  },

  /*
   **  CREATE QUERIES
   */

  createNewTopic: (newTopic) => {
    return new Promise((resolve, reject) => {

      const query = `INSERT INTO public.topics (title, topic_description, "users_permissions_user", category) VALUES
        ($1, $2, $3, $4)`;
      client.query(query, [newTopic.title, newTopic.topicDesc, newTopic.users_id, newTopic.categoryId], forumDB
        .promiseCB(resolve, reject));
    });

  },

  createNewMessage: (newMessage) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO public.messages ("users_permissions_user", message_content, topic) VALUES
          ($1, $2, $3)`;
      client.query(query, [newMessage.users_id, newMessage.messageContent, newMessage.topicId], forumDB
        .promiseCB(resolve, reject));
    });
  },

  /*
   **  DELETE QUERIES
   */

  delMessageById: (objParams) => {
    return new Promise((resolve, reject) => {

      const preparedQuery = {
        text: `DELETE FROM public.messages WHERE id=$1 AND public."users-permissions_user"=$2;`,

        values: [objParams.messageId, objParams.users_id]
      }
      client.query(preparedQuery, forumDB.promiseCB(resolve, reject));
    });
  },

  /*
   **  UPDATE QUERIES
   */

  updateMessage: (objParams, callback) => {
    return new Promise((resolve, reject) => {

      const preparedQuery = {
        text: ` UPDATE public.messages
                  SET "message_content" = $1
                  WHERE id=$2 AND public."users-permissions_user"=$3;
        `,
        values: [objParams.message, objParams.messageId, objParams.users_id]
      }
      client.query(preparedQuery, forumDB.promiseCB(resolve, reject));
    });
  }

};

module.exports = forumDB;
