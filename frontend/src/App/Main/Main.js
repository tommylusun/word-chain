import React from 'react'
// import wordChaingql from '../../GraphQL/wordChain'
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Query } from "react-apollo";
import LinearProgress from '@material-ui/core/LinearProgress';

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
    <div style={{ 'margin': 'auto', 'margin-top': '50px', 'padding': '50px', 'width': '500px' }}>

            <div style={{'font-size':'3em'}}>Word Chain</div>
            <p></p>
            <Query query={GET_WORD_CHAINS}>
                {({ loading, error, data }) => {
                    if (loading) return (<LinearProgress style={{margin: '50px'}} />);
                    if (error) return `Error! ${error.message}`;

                    return (
                        <div>
                            {data.wordChains.map(chain => {
                                return (
                                    <Link style={{textDecoration:'none'}} to={"/chain/" + chain._id}>
                                        <Card style={{'background':'#ffffff55','margin':'20px'}}>
                                            <CardContent>
                                                <div style={{ padding:'10px','font-size': '1.5em'}}>{new Date(+chain.date).toDateString()}</div>
                                            </CardContent>
                                        </Card>
                                    </Link>
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