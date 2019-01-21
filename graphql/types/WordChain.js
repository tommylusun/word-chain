import { gql } from "apollo-server-express";

export default gql`
  type WordChain {
    _id: ID
    lastIndex: Int!
    lastLetter: String
    words: [Word]!
    date: String!
  }
  type Query {
    wordChain(id: ID): WordChain
    wordChains: [WordChain]
  }
  type Mutation {
    createNewChain: WordChain
  }
`;