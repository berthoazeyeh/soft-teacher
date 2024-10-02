


import {
  HttpLink,
  ApolloLink,
  ApolloClient,
  InMemoryCache,
  split,
} from '@apollo/client';
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "apollo-link-ws";
import { setContext } from "apollo-link-context";
import { retrieveSavedToken } from 'utils';


const httpLink = new HttpLink({
  uri: "https://api.lewootrack.com", // UAT
});

const wsLink = new WebSocketLink({
  uri: "wss://api.lewootrack.com", // UAT

  options: {
    reconnect: true,
    lazy: true,
    connectionParams: async () => ({
      Authorization: `Bearer ${await retrieveSavedToken()}`,
    }),
  },
});

const cache = new InMemoryCache();

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await retrieveSavedToken();
  // return the headers to the context so httpLink can read them
  /* eslint-disable indent */
  return token
    ? {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    }
    : {
      headers: { ...headers },
    };
  /* eslint-enable indent */
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink)
);

const clients = new ApolloClient({
  link: ApolloLink.from([link]),
  cache: cache,
});
export const client = clients;

export const client1 = new ApolloClient({
  uri: 'http://79.143.185.100:5000/graphql', // Remplacez par l'URL de votre serveur GraphQL
  cache: new InMemoryCache(),
});
// export default client;