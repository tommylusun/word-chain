import React, { useState } from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Main from '../Main/Main';
import Login from '../Login/Login';
import WordChainRoom from '../WordChainRoom/WordChainRoom'

const AppRouter = () => {
    // Declare a new state variable, which we'll call "count"

    return (<BrowserRouter>
        <div>
        <Link to="/login">Login / Register</Link>
            <nav>
                        <Link to="/">Home</Link>
            </nav>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/login" exact component={Login} />
                <Route path="/chain/:chainId" exact component={props => (<WordChainRoom {...props} />)} />
            </Switch>
        </div>
    </BrowserRouter>);
};

export default AppRouter;