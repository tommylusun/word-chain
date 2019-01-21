export default `
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