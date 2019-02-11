import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import AddWord from "../Main/AddWord";

const GET_WORDCHAIN = gql`
query WordChain($id: String!){
    wordChain(id: $id){
        _id
        lastLetter
        lastIndex
        date
        words{
            value
        }
    }
  }
`;

const WORD_ADDED = gql`
subscription WordAdded($chainId: String!){
    wordAdded(wordChainId: $chainId){
        value
    }
  }
`;
class WordChainRoom extends Component {

    componentDidMount() {
        console.log(this.props);
    }
    render() {
        return (<Query query={GET_WORDCHAIN} variables={{ id: this.props.match.params.chainId }}>
            {({ loading, error, data, subscribeToMore }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;
                const chain = data.wordChain;
                const date = new Date(+chain.date);
                return (
                    <div>
                        <h3>{date.toDateString()}</h3>
                        <div>Last letter: {chain.lastLetter}</div>
                        <WordList chain={chain} subscribeToMore={subscribeToMore}></WordList>
                        <div>
                            <AddWord chainId={this.props.match.params.chainId} userId="5c45250ed3a4aef95e136f31"></AddWord>
                        </div>
                    </div>
                );
            }}
        </Query>);
    }
};

class WordList extends Component {

    componentDidMount() {
        this.props.subscribeToMore({
            document: WORD_ADDED,
            variables: { chainId: this.props.chain._id },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                return Object.assign({}, prev.wordChain, {
                    wordChain: {
                        ...prev.wordChain,
                        words: [...prev.wordChain.words, subscriptionData.data.wordAdded]
                    }
                });
            }
        })
    }
    render() {
        return (
            <div>
                {this.props.chain.words.map((word) => (
                    <li>{word.value}</li>
                ))}
            </div>
        );
    }
}

export default WordChainRoom;