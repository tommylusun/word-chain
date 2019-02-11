import React from 'react'
import wordChaingql from '../../GraphQL/wordChain'
import { Link } from 'react-router-dom';

import { Query } from "react-apollo";
const Main = () => (
    <div>
        <Query query={wordChaingql}>
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