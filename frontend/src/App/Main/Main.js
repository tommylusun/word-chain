import React from 'react'
import wordChainGql from '../../GraphQL/wordchain'
import { Query } from "react-apollo";

const AppRouter = () => (
    <Query query={wordChainGql}>
        {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            return (
                <div>
                    {data.wordChains.map(chain => {
                        return (
                            <div>
                                <div>{chain._id}</div>
                                {chain.words.map((word) => (
                                    <li>{word.value}</li>
                                ))}
                            </div>
                        );

                    }

                    )}
                </div>
            );
        }}
    </Query>
);

export default AppRouter;