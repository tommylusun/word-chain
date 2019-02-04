import React from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Main from '../Main/Main';

const AppRouter = () => (
    <BrowserRouter>
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about/">About</Link>
                    </li>
                    <li>
                        <Link to="/users/">Users</Link>
                    </li>
                </ul>
            </nav>
            <Switch>
                <Route path="/" exact component={Main} />
            </Switch>
        </div>
    </BrowserRouter>
);

export default AppRouter;