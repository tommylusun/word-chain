import React from 'react'
import wordChaingql from '../../GraphQL/wordChain'

import { Query } from "react-apollo";
import AddWord from "./AddWord";
import Room from "../WordChainRoom/WordChainRoom";
const Main = () => (
    <div>
        {/* <Query query={wordChaingql}>
            {({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;

                return (
                    <div>
                        {data.wordChains.map(chain => {
                            return (
                                <div>
                                    <div>{chain._id}</div>
                                    <div>Last letter: {chain.lastLetter}</div>
                                    {chain.words.map((word) => (
                                        <li>{word.value}</li>
                                    ))}
                                </div>
                            );
                        }
                        )}
                        <div>
                            <AddWord chainId="5c45251dd3a4aef95e136f32" userId="5c45250ed3a4aef95e136f31"></AddWord>
                        </div>
                    </div>
                );
            }}
        </Query> */}
        <div>
            <Room chainId="5c45251dd3a4aef95e136f32">

            </Room>
        </div>
    </div>

);

export default Main;