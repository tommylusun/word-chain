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
            _id
            username
            email
        }
    }
  }
`;
class WordChainRoom extends Component {
    state = { loggedIn: false };
    componentDidMount() {
        console.log(this.props);
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        const token = localStorage.getItem('token');
        if (token) {
            this.setState({ loggedIn: true })
        }
    }
    render() {
        return (
            <div>
                <Query query={GET_WORDCHAIN} variables={{ id: this.props.match.params.chainId }}>
                    {({ loading, error, data, subscribeToMore }) => {
                        if (loading) return "Loading...";
                        if (error) return `Error! ${error.message}`;
                        console.log(data);
                        const chain = data.wordChain;
                        const date = new Date(+data.wordChain.date);
                        return (
                            <div>
                                <h3>{date.toDateString()}</h3>
                                <WordList chain={chain} subscribeToMore={subscribeToMore}></WordList>
                                {this.state.loggedIn ? (<div>
                                    <AddWord chainId={this.props.match.params.chainId}></AddWord>
                                </div>) :
                                    <div>Please log in if you want to play</div>}
                            </div>
                        );
                    }}
                </Query>
                <div style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </div>);
    }
};

class WordList extends Component {

    componentDidMount() {
        this.props.subscribeToMore({
            document: WORD_ADDED,
            variables: { chainId: this.props.chain._id },
            updateQuery: (prev, { subscriptionData }) => {
                console.log(prev);
                console.log(subscriptionData);
                if (!subscriptionData.data) return prev.wordChain;

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
        let users = {};
        this.props.chain.words.map(word => {
            if (users[word.user.username]) {
                users[word.user.username] += word.points;
            } else {
                users[word.user.username] = word.points;
            }
        });
        return (
            <div>

                <div>
                    Leaderboards:
                    <div>
                        {Object.keys(users).map(user => {
                            return (<div>{user} - {users[user]} points</div>);
                        })}
                    </div>
                </div>
                <div style={{ height: '50px' }}></div>
                <div style={{borderTop: '1px solid black'}}>
                    {this.props.chain.words.map((word, index) => {
                        if (this.props.chain.words.length-1 === index){
                            return (<div><b>Latest word:</b> {word.value}</div>)
                        }
                        return (
                            <div>{word.value} </div>
                        )
                    })}
                </div>


            </div>
        );
    }
}

export default WordChainRoom;