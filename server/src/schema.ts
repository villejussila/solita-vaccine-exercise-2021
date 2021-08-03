import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Vaccination {
    vaccinationId: String
    sourceBottle: String!
    gender: String!
    vaccinationDate: String!
  }
  type Query {
    hello: String
    vaccinationCount: Int!
    vaccineOrderCount: Int!
    allVaccinations: [Vaccination!]!
  }
`;
