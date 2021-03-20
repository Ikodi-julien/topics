/*--------------------------------------------------*/
/*----------- HAMBURGER ----------------------------*/
/*--------------------------------------------------*/

export const hamMenu = {

  hamburger: document.getElementById("nav-hamburger"),
  menu: document.getElementsByClassName('header__nav')[0],

  addEventListener: () => {

    if (document.getElementsByClassName('header__nav').length) {
      hamMenu.hamburger.addEventListener("click", () => {
        hamMenu.hamburger.classList.toggle("open");
        hamMenu.menu.classList.toggle("header__nav__show");
      })
    }
  }
};
