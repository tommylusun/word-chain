import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { withRouter} from 'react-router-dom';

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
    };
    componentDidMount() {
    }

    async handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        await this.setState({
            [name]: value
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
            localStorage.setItem('token',token.data.loginUser);
        } else {
            token = await mutationCall({
                variables: {
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password
                }
            });
            localStorage.setItem('token',token.data.registerUser);
        }
        window.dispatchEvent( new Event('storage') );
        this.props.history.push('/');
    }

    render() {
        return (
            <div>
                <div>
                    <button onClick={() => this.setState({ login: !this.state.login })} >{this.state.login ? 'register new account' : 'log in to your account'}</button>

                </div>
                {this.state.login ? (<h2>Login</h2>) : (<h2>New Account</h2>)}
                <Mutation mutation={this.state.login ? LOGIN : REGISTER}>
                    {(mutationCall, { loading, error, onComplete }) => (
                        <div>
                            <form onSubmit={(e) => this.handleSubmit(e, mutationCall)}>
                                {
                                    !this.state.login ?
                                        <div>
                                            <label htmlFor="username">Display Name:</label>
                                            <input name="username" type="text" value={this.state.username} onChange={(e) => this.handleChange(e)} />
                                        </div> : null
                                }
                                <div>
                                    <label htmlFor="email">Email:</label>
                                    <input name="email" type="text" value={this.state.email} onChange={(e) => this.handleChange(e)} />
                                </div>
                                <div>
                                    <label htmlFor="password">Password:</label>
                                    <input name="password" type="password" value={this.state.password} onChange={(e) => this.handleChange(e)} />
                                </div>

                                <input type="submit" value="Submit" />
                            </form>
                            {error && <p>Error: {error.message}</p>}
                        </div>
                    )}
                </Mutation>




            </div>
        );
    }
};
export default withRouter(Login);