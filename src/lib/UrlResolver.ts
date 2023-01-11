import { config } from "../constants";

class UrlResolver {
  index() {
    return "/"; //http://localhost:3000
  }

  // API
  graphql() {
    return config.graphqlHttpEndpoint;
  }

  graphqlSocket() {
    // return `ws://192.168.1.66:4001/graphql`;
    // return `http://localhost:4000/graphql`;
    return config.graphqlSocketEndpoint;
  }

  googleLogout(host: string) {
    return `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${host}`;
  }
}

export const urlResolver = new UrlResolver();
