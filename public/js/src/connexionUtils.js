export const connexionUtils = {

  init: () => {

    if (document.querySelectorAll('.connexion').length) {
      connexionUtils.addEventListeners();
      connexionUtils.addHomeButton();
    }
  },

  createAccountModale: document.getElementById('createAccountModale'),
  lostPassModale: document.getElementById('lostPassModale'),
  showCreateProfileButton: document.getElementById('showCreateProfile'),
  showLostPassButton: document.getElementById('showLostPass'),
  quitCreateProfil: document.getElementById('quitCreateProfil'),
  quitLostPass: document.getElementById('quitLostPass'),

  addEventListeners: () => {

    connexionUtils.showCreateProfileButton.addEventListener('click', () => {
      connexionUtils.createAccountModale.classList.toggle('--connexion__show');
    })

    connexionUtils.showLostPassButton.addEventListener('click', () => {
      connexionUtils.lostPassModale.classList.toggle('--connexion__show');
    })

    connexionUtils.quitCreateProfil.addEventListener('click', () => {
      connexionUtils.createAccountModale.classList.toggle('--connexion__show');
    })

    connexionUtils.quitLostPass.addEventListener('click', () => {
      connexionUtils.lostPassModale.classList.toggle('--connexion__show');
    })
  },

  addHomeButton: () => {

    const infouserButton = document.getElementById('infouserButton');

    const homeButton = document.createElement('div');
    homeButton.classList.add('infouser__button');
    homeButton.id = "quitConnexionButton";
    homeButton.innerHTML = '<i class="fas fa-caravan"></i>';

    infouserButton.before(homeButton);

    homeButton.addEventListener('click', () => {
      location.href = '/';
    })
  }
}
