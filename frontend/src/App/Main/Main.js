import React from 'react'
// import wordChaingql from '../../GraphQL/wordChain'
import { Link } from 'react-router-dom';
import gql from "graphql-tag";

import { Query } from "react-apollo";

const GET_WORD_CHAINS = gql`

query{
    wordChains{
      _id
      lastLetter
      lastIndex
      date
    }
  }
`;
const Main = () => (
    <div style={{'margin':'auto','margin-top':'50px','border':'1px solid black','padding':'50px','width':'500px'}}>
        <h1>Word Chain</h1>
        <p></p>
        <Query query={GET_WORD_CHAINS}>
            {({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;

                return (
                    <div>
                        {data.wordChains.map(chain => {
                            return (
                                <Link to={"/chain/"+chain._id}><h3>{new Date(+chain.date).toDateString()}</h3></Link>
                            );
                        }
                        )}
                    </div>
                );
            }}
        </Query>
    </div>
);

export default Main;