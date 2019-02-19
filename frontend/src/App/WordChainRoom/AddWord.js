import React, { useState } from 'react'
// import addWord from '../../GraphQL/addWord'
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Button from "../Common/Button";
import TextField from '@material-ui/core/TextField';

const ADD_WORD = gql`
  mutation addWord($chainId: ID!, $value: String!) {
    addWord(chainId: $chainId, value: $value) {
      words {
          value
      }
    }
  }
`;
const AddWord = (props) => {
    const [input, handleChange] = useState("");

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
                                addWord({ variables: { chainId: props.chainId, value: input } });
                                handleChange('');
                            }}
                        >
                            <TextField margin="normal" variant="outlined" label="New Word"
                                type="text" value={input} onChange={(e) => handleChange(e.target.value)}
                            />
                            <div>
                                <Button type="submit">Add word</Button>
                            </div>
                        </form>
                        {error && <p>{error.message.replace("GraphQL error: ", "").trim()}</p>}
                        {loading ? <p style={{'min-height':'50px'}}>Checking...</p>:<p style={{'min-height':'50px'}}></p>}
                    </div>
                )
            }}
        </Mutation>
    );
}


export default AddWord;