const fetch = require('node-fetch');


const strapi = {

  logUser: async (body) => {

    try {
      const response = await fetch('http://localhost:1337/auth/local', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: body
      })

      return await response.json();

    } catch (error) {
      console.log(error);
    };
  },

  getUser: async (body) => {
    try {
      const response = await fetch('http://localhost:1337/users/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: body
      })

      return await response.json();

    } catch (error) {
      console.log(error);
    };
  },

  /**
   * Register a new user in strapi API
   */
  registerUser: async (body) => {

    try {
      const response = await fetch('http://localhost:1337/auth/local/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const resJSON = await response.json();

      // Faire la gestion d'erreur ici, car c'est mon choix !
      if (typeof resJSON.data !== 'undefined') {

        console.log(resJSON)
        return { message: resJSON.data[0].messages[0].message }

      } else if (typeof resJSON.user !== 'undefined') {
        return resJSON;

      } else {
        return { error: 'c la misère !' };
      }

    } catch (error) {
      return { error };
    };
  },
}


module.exports = strapi;
