export const userInfoUtils = {

  infouserButton: document.getElementById('infouserButton'),
  infouser: document.getElementById('infouser'),
  shownTimeout: 0,

  /**
   * Affiche les infos destinées à l'utilisateur
   */
  showInfo: () => {

    if (userInfoUtils.shownTimeout) clearTimeout(userInfoUtils.shownTimeout);

    userInfoUtils.infouser.classList.toggle('--showInfo');

    userInfoUtils.shownTimeout = setTimeout(() => {
      if (infouser.classList.contains('--showInfo')) {

        infouser.classList.remove('--showInfo');
      }
    }, 3000)
  },

  /**
   * Allow to show userInfo with a click on button
   */
  addListener: () => {
    if (document.getElementById('infoMessage') !== null) userInfoUtils.showInfo();
    infouserButton.addEventListener('click', userInfoUtils.showInfo);
  }
};
