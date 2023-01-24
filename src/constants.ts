export const brandName = "Analo";
export const SEARCH_DEBOUNCE = 200; // millisec
export const ICON_SIZE = 15;

export const YOUTUBE_DATA_API_DATE_FORMAT = "YYYY-MM-DD";
const prod = {
  graphqlHttpEndpoint: "http://192.168.1.66:4001/graphql",
  graphqlSocketEndpoint: "ws://192.168.1.66:4001/graphql",
};

const dev = {
  graphqlHttpEndpoint: "http://192.168.1.66:4001/graphql",
  graphqlSocketEndpoint: "ws://192.168.1.66:4001/graphql",
};

export const config = process.env.NODE_ENV === "development" ? dev : prod;
