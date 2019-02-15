import { gql } from "apollo-server-express";

export default gql`
  type Word {
    _id: ID
    sequence: Int!
    value: String!
    user: User!
    wordChain: WordChain!
    points: Int!
  }
  type Query {
    word(_id: ID, sequence: Int, value: String): Word
    words(id: ID, chainId: ID): [Word]
  }
  type Mutation {
    addWord(id: ID!, value: String!, userId: ID!): WordChain
  }
  type Subscription {
    wordAdded(wordChainId: String!): Word
  }
`;