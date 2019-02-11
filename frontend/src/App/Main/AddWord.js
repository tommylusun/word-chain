import React from 'react'
import addWord from '../../GraphQL/addWord'
import { Mutation } from "react-apollo";

const AddWord = (props) => {

    let input;
    return (
        <Mutation mutation={addWord}>
            {(addWord, { loading, error }) => {
                if (error) {
                    console.log(error.message);
                }
                return (
                    <div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                addWord({ variables: { chainId: props.chainId, value: input.value, userId: props.userId } });
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