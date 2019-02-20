import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import AddWord from "./AddWord";
import Button from "../Common/Button"
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const GET_WORDCHAIN = gql`
query WordChain($id: String!, $limit: Int, $offset: Int){
    wordChain(id: $id){
        _id
        lastLetter
        lastIndex
        date
        words(limit: $limit, offset: $offset){
            value
            points
            user{
                username
                email
            }
        }
    }
  }
`;

const WORD_ADDED = gql`
subscription WordAdded($chainId: String!){
    wordAdded(wordChainId: $chainId){
        value
        points
        user{
            username
            email
        }
    }
  }
`;
class WordChainRoom extends Component {
    state = {
        loggedIn: false,
        limit: 25,
        offset: 0
    };
    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token) {
            this.setState({ loggedIn: true })
        }
    }
    render() {
        return (
            <div>
                <Query query={GET_WORDCHAIN} variables={{
                    id: this.props.match.params.chainId,
                    limit: this.state.limit,
                    offset: this.state.offset
                }}>

                    {({ loading, error, data, subscribeToMore, fetchMore }) => {
                        if (loading) return "Loading...";
                        if (error) return `Error! ${error.message}`;
                        const chain = data.wordChain;
                        const date = new Date(+data.wordChain.date);
                        return (
                            <div>
                                <div style={{ padding: '15px', 'font-size': '2em' }}>{date.toDateString()}</div>
                                <p>Rules:</p>
                                <p>Word's first letter must match last letter of the latest word</p>
                                <p>Word must be longer than 2 letters</p>
                                <p>Word cannot be used twice in one game</p>
                                {this.state.loggedIn ? (<div>
                                    <AddWord chainId={this.props.match.params.chainId}></AddWord>
                                </div>) :
                                    <div style={{ padding: '15px' }}>Please log in if you want to play</div>}
                                <WordList chain={chain} subscribeToMore={subscribeToMore}></WordList>
                                {(chain.lastIndex > chain.words.length) ?
                                    (<Button style={{ margin: '25px' }} onClick={() => {
                                        fetchMore({
                                            variables: {
                                                offset: chain.words.length
                                            },
                                            updateQuery: (prev, { fetchMoreResult }) => {
                                                if (!fetchMoreResult) return prev;
                                                return Object.assign({}, prev, {
                                                    wordChain: {
                                                        ...fetchMoreResult.wordChain,
                                                        words: [...prev.wordChain.words, ...fetchMoreResult.wordChain.words]
                                                    }
                                                });
                                            }
                                        });
                                    }}>Show more</Button>) :
                                    (<div style={{ margin: '25px' }}><b>End of list</b></div>)
                                }
                            </div>
                        );
                    }}
                </Query>
            </div>);
    }
};

class WordList extends Component {

    componentDidMount() {
        this.props.subscribeToMore({
            document: WORD_ADDED,
            variables: { chainId: this.props.chain._id },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev.wordChain;

                return Object.assign({}, prev.wordChain, {
                    wordChain: {
                        ...prev.wordChain,
                        words: [subscriptionData.data.wordAdded, ...prev.wordChain.words]
                    }
                });
            }
        })
    }
    render() {
        // let users = {};
        // this.props.chain.words.map(word => {
        //     if (users[word.user.username]) {
        //         users[word.user.username] += word.points;
        //     } else {
        //         users[word.user.username] = word.points;
        //     }
        // });
        return (
            <div>

                {/* <div>
                    Leaderboards:
                    <div>
                        {Object.keys(users).map(user => {
                            return (<div>{user} - {users[user]} points</div>);
                        })}
                    </div>
                </div> */}
                <List style={{ borderTop: '1px solid black' }}>
                    {this.props.chain.words.map((word, index) => {
                        if (index === 0) {
                            return (
                                <List style={{ 'font-size': '2em' }} key={index}>
                                    <b style={{ 'font-size': '1.3rem'}}> Latest word -> </b>
                                    {word.value}
                                </List>)
                        }
                        return (
                            <List style={{ 'font-size': '1.5em' }} key={index}>{word.value} </List>
                        )
                    })}
                </List>


            </div>
        );
    }
}

export default WordChainRoom;