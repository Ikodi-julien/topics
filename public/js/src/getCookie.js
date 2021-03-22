export const getCookie = {

  /**
   * Gets a cookie value from his name
   * @param {String} name 
   * @returns string
   */
  get: (name) => {

    try {
      return document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith(`${name}=`))
        .split('=')[1];
    } catch (error) {
      return false;
    }
  }
}
