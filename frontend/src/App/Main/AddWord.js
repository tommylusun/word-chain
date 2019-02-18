import React from 'react'
// import addWord from '../../GraphQL/addWord'
import { Mutation } from "react-apollo";
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
const AddWord = (props) => {

    let input;
    return (
        <Mutation mutation={ADD_WORD}>
            {(addWord, { loading, error }) => {
                if (error) {
                    console.log(error.message);
                }
                return (
                    <div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                addWord({ variables: { chainId: props.chainId, value: input.value } });
                                input.value = "";
                            }}
                        >
                            <input
                                ref={node => {
                                    input = node;
                                }}
                            />
                            <button type="submit">Add word</button>
                        </form>
                        {error && <p>{error.message.replace("GraphQL error: ", "").trim()}</p>}
                        {loading && <p>Checking...</p>}
                    </div>
                )
            }}
        </Mutation>
    );
}


export default AddWord;