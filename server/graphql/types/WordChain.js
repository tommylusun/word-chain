import { gql } from "apollo-server-express";

export default gql`
  type WordChain {
    _id: ID
    lastIndex: Int!
    lastLetter: String
    words(limit: Int, offset: Int): [Word]!
    date: String!
  }
  type Query {
    wordChain(id: String): WordChain
    wordChains: [WordChain]
  }
  type Mutation {
    createNewChain: WordChain
  }
`;