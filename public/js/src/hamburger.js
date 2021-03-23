export const hamMenu = {

  hamburger: document.getElementById("nav-hamburger"),
  menu: document.getElementsByClassName('header__nav'),

  addEventListener: () => {

    if (hamMenu.menu.length) {
      hamMenu.hamburger.addEventListener("click", () => {
        hamMenu.hamburger.classList.toggle("open");
        hamMenu.menu[0].classList.toggle("header__nav__show");
      })
    }
  }
};
