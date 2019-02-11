import gql from "graphql-tag";

const ADD_WORD = gql`
  mutation addWord($chainId: ID!, $value: String!, $userId: ID!) {
    addWord(id: $chainId, value: $value, userId: $userId) {
      _id
      words {
          _id
          value
      }
    }
  }
`;

export default ADD_WORD;