"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
// Construct a schema, using GraphQL schema language
const typeDefs = apollo_server_express_1.gql `
  type Query {
    hello: String
  }
`;
// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};
const server = new apollo_server_express_1.ApolloServer({ typeDefs, resolvers });
const app = express_1.default();
void server.start().then(() => server.applyMiddleware({ app }));
app.listen({ port: 4000 }, () => console.log(`Server started at http://localhost:4000${server.graphqlPath}`));
