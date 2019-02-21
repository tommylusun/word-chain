import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Main from '../Main/Main';
import Login from '../Login/Login';
import WordChainRoom from '../WordChainRoom/WordChainRoom'
import Button from "../Common/Button";

const AppRouter = (props) => {
    // Declare a new state variable, which we'll call "count"
    const [auth, setLoggedIn] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        window.addEventListener('storage', e => setLoggedIn(!!localStorage.getItem('token')));

        return () => {
            window.removeEventListener('storage', e => setLoggedIn(!!localStorage.getItem('token')));
        };
    });

    return (<BrowserRouter>
        <div style={{ textDecoration: 'none', 'margin': '25px' }}>
            <Link style={{ textDecoration: 'none', 'margin': '25px' }} to="/"><Button>Home</Button></Link>
            {!auth ?
                <Link style={{ textDecoration: 'none' }} to="/login"><Button>Login / Register</Button></Link>
                :
                <Button onClick={() => {
                    localStorage.removeItem('token');
                    setLoggedIn(false);
                }}>Logout</Button>
            }
            <Button style={{ textDecoration: 'none', 'margin': '25px' }}><a href='https://github.com/tommylusun/word-chain'>Github</a></Button>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/login" exact component={Login} />
                <Route path="/chain/:chainId" exact render={props => (<WordChainRoom {...props} />)} />
            </Switch>
        </div>
    </BrowserRouter>);
};

export default AppRouter;