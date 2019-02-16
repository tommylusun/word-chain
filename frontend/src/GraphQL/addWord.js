import gql from "graphql-tag";

const ADD_WORD = gql`
  mutation addWord($chainId: ID!, $value: String!) {
    addWord(id: $chainId, value: $value) {
      words {
          value
      }
    }
  }
`;

export default ADD_WORD;