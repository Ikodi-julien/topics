

export const profileRequest = {
  
  updatePseudo: async (event) => {
    event.preventDefault();
    // console.log('dans update');

    const form = event.target;

    // console.log(form);
    // Récup du champ pseudo
    const newPseudo = form.querySelector('#pseudo').value;
    if (newPseudo === "") return

    //Récup de userId
    const userId = document.querySelector('#infoUserId').textContent;
    if (typeof userId === "undefined") return

    // Demande PUT à strapi
    // Prépa des données à envoyer
    const body = JSON.stringify({
      username: newPseudo,
    })
    // console.log(body);

    // Récupérer le token laissé au moment de la connexion
    const token = getCookie('token');

    if (!token) {
      alert("Vous n'êtes pas autorisé, désolé...");
      return
    }

    const authorization = `Bearer ${token}`;

    try {
      const response = await fetch(`http://localhost:1337/users/${userId}`, {
        method: 'PUT',
        headers: {
          "content-type": "application/json",
          "Authorization": authorization
        },
        body
      });

      if (response.ok) {
        // prendre en compte les infos
        alert("Reconnectez vous pour que les modifs prennent effet");
        return
      } else {
        throw ({ resStatus: response.status });
      }

    } catch (error) {

      const errors = [];
      errors.push(error);

      console.log(errors);
      alert("voir l'erreur en console");
    }
    return false;
  },

  updateEmail: async (event) => {
    event.preventDefault();
    console.log('dans update');

    const form = event.target;

    console.log(form);
    // Récup du champ pseudo
    const newEmail_1 = form.querySelector('#email1').value;
    const newEmail_2 = form.querySelector('#email2').value;
    if (newEmail_1 === "" || newEmail_2 === "") return;
    if (newEmail_1 !== newEmail_2) {
      alert('les deux emails ne sont pas identiques');
      return
    }

    //Récup de userId
    const userId = document.querySelector('#infoUserId').textContent;
    if (typeof userId === "undefined") return

    // Demande PUT à strapi
    // Prépa des données à envoyer
    const body = JSON.stringify({
      email: newEmail_1
    })
    console.log(body);

    // Récupérer le token laissé au moment de la connexion
    const token = getCookie('token');

    if (!token) {
      alert("Vous n'êtes pas autorisé, désolé...");
      return
    }

    const authorization = `Bearer ${token}`;

    try {
      const response = await fetch(`http://localhost:1337/users/${userId}`, {
        method: 'PUT',
        headers: {
          "content-type": "application/json",
          "Authorization": authorization
        },
        body
      });

      if (response.ok) {
        // prendre en compte les infos
        alert("Reconnectez vous pour que les modifs prennent effet");
        return
      } else {
        throw ({ resStatus: response.status });
      }

    } catch (error) {

      const errors = [];
      errors.push(error);

      console.log(errors);
      alert("voir l'erreur en console");
    }
    return false;
  },
}