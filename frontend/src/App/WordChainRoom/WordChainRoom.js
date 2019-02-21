import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import AddWord from "./AddWord";
import Button from "../Common/Button"
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';

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
        leaderboard{
            username
            score
        }
    }
  }
`;

const WORD_ADDED = gql`
subscription WordAdded($chainId: String!){
    wordAdded(wordChainId: $chainId){
        word{
            value
            points
            user{
                username
                email
            }
        }
        leaderboard{
            username
            score
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
                        if (loading) return (<LinearProgress style={{ margin: '50px' }} />);
                        if (error) return `Error! ${error.message}`;
                        const chain = data.wordChain;
                        const date = new Date(+data.wordChain.date);
                        return (
                            <div>
                                <div style={{ padding: '15px', fontSize: '2em' }}>{date.toDateString()}</div>
                                <p>Word's first letter must match last letter of the latest word</p>
                                <p>Word must be longer than 2 letters</p>
                                <p>Word cannot be used twice in one game</p>
                                {this.state.loggedIn ? (
                                    <div>
                                        <AddWord chainId={this.props.match.params.chainId}></AddWord>
                                    </div>) :
                                    <div style={{ padding: '15px' }}>Please log in if you want to play</div>
                                }

                                <div>
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
                        words: [subscriptionData.data.wordAdded.word, ...prev.wordChain.words],
                        leaderboard: subscriptionData.data.wordAdded.leaderboard
                    }
                });
            }
        })
    }
    render() {
        return (
            <div>
                <div style={{ position: 'absolute', margin: '25px' }}>
                    <div style={{ fontSize: '1.5em' }}>Leaderboard:</div>
                    <div>
                        {this.props.chain.leaderboard.map((user, index) => {
                            return (
                                <div>
                                    <Chip avatar={<Avatar style={{'backgroundColor':'transparent'}}>{index + 1}</Avatar>}
                                        variant="outlined"
                                        label={`${user.username} : ${user.score} points`} />
                                </div>);
                        })}
                    </div>
                </div>
                <List style={{ borderTop: '1px solid black' }}>
                    {this.props.chain.words.map((word, index) => {
                        if (index === 0) {
                            return (
                                <div style={{ fontSize: '2em' }} key={index}>
                                    <Chip style={{ fontSize: '1rem', margin: '20px' }}
                                        label="Latest word"
                                        variant="outlined"
                                    />
                                    {word.value}
                                </div>)
                        }
                        return (
                            <div style={{ fontSize: '1.5em' }} key={index}>{word.value} </div>
                        )
                    })}
                </List>


            </div>
        );
    }
}

export default WordChainRoom;