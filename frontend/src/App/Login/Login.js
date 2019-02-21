import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { withRouter } from 'react-router-dom';
import Button from "../Common/Button";
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const LOGIN = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password)
  }
`;

const REGISTER = gql`
  mutation registerUser($username: String! $email: String!, $password: String!) {
    registerUser(username: $username, email: $email, password: $password)
  }
`;
class Login extends Component {

    state = {
        login: true,
        username: '',
        email: '',
        password: '',
        shrink: false
    };
    componentDidMount() {
    }

    async handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ shrink: true });
        await this.setState({
            [name]: value,
            shrink: true
        });
    }

    async handleSubmit(event, mutationCall) {
        event.preventDefault();
        let token = '';
        if (this.state.login) {
            token = await mutationCall({
                variables: {
                    email: this.state.email,
                    password: this.state.password
                }
            });
            localStorage.setItem('token', token.data.loginUser);
        } else {
            token = await mutationCall({
                variables: {
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password
                }
            });
            localStorage.setItem('token', token.data.registerUser);
        }
        window.dispatchEvent(new Event('storage'));
        this.props.history.push('/');
    }

    render() {
        return (

            <Card style={{ 'background': '#ffffff55', 'margin': 'auto', 'margin-top': '50px', 'padding': '50px', 'width': '500px' }}>
                <CardContent>
                    <div >
                        <div>
                            <Button onClick={() => this.setState({ login: !this.state.login })} >{this.state.login ? 'Register new account' : 'Log in to your account'}</Button>
                        </div>
                        <div style={{ 'font-size': '2em', 'padding': '25px' }}>{this.state.login ? "Login" : "New Account"}</div>

                        <Mutation mutation={this.state.login ? LOGIN : REGISTER}>
                            {(mutationCall, { loading, error, onComplete }) => (
                                <div>
                                    <form onSubmit={(e) => this.handleSubmit(e, mutationCall)}>
                                        {!this.state.login ?
                                            <div>
                                                <TextField margin="normal" variant="outlined" label="Display Name" name="username" type="text" value={this.state.username} onChange={(e) => this.handleChange(e)} />
                                            </div> : null
                                        }
                                        <div>
                                            <TextField InputLabelProps={{ shrink: this.state.shrink }} margin="normal" variant="outlined" label="Email" name="email" type="text" value={this.state.email} onChange={(e) => this.handleChange(e)} />
                                        </div>
                                        <div>
                                            <TextField margin="normal" variant="outlined" label="Password" name="password" type="password" value={this.state.password} onChange={(e) => this.handleChange(e)} />
                                        </div>

                                        <Button type="submit">Submit</Button>
                                    </form>
                                    {error && <p>{error.message.replace("GraphQL error: ", "").trim()}</p>}
                                </div>
                            )}
                        </Mutation>
                    </div>
                </CardContent>
            </Card>

        );
    }
};
export default withRouter(Login);