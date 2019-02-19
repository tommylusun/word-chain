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
        <div style={{ 'text-decoration': 'none', 'margin': '25px' }}>
            <Link style={{ 'text-decoration': 'none', 'margin': '25px' }} to="/"><Button>Home</Button></Link>
            {!auth ?
                <Link style={{ 'text-decoration': 'none' }} to="/login"><Button>Login / Register</Button></Link>
                :
                <Button onClick={() => {
                    localStorage.removeItem('token');
                    setLoggedIn(false);
                }}>Logout</Button>
            }
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/login" exact component={Login} />
                <Route path="/chain/:chainId" exact component={props => (<WordChainRoom {...props} />)} />
            </Switch>
        </div>
    </BrowserRouter>);
};

export default AppRouter;