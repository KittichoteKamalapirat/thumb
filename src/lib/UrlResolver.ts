class UrlResolver {
  index() {
    return "/"; //http://localhost:3000
  }

  home() {
    return "/";
  }

  myTests() {
    return "/tests";
  }

  createTest() {
    return "/create-test";
  }

  myAccount() {
    return "/account";
  }

  googleLogout(host: string) {
    return `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${host}`;
  }
}

export const urlResolver = new UrlResolver();
