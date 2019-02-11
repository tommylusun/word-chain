import React from 'react'
import wordChaingql from '../../GraphQL/wordChain'
import { Link } from 'react-router-dom';

import { Query } from "react-apollo";
import AddWord from "./AddWord";
import Room from "../WordChainRoom/WordChainRoom";
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
                                <Link to={"/chain/"+chain._id}><h3>{chain._id}</h3></Link>
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