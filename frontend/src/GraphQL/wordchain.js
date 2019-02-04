import gql from "graphql-tag";

const GET_WORD_CHAINS = gql`

query{
    wordChains{
      _id
      lastLetter
      lastIndex
      words{
        value
      }
    }
  }
`;

export default GET_WORD_CHAINS;