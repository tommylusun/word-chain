import React from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Main from '../Main/Main';
import WordChainRoom from '../WordChainRoom/WordChainRoom'

const AppRouter = () => (
    <BrowserRouter>
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
            </nav>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/chain/:chainId" exact component={props => (<WordChainRoom {...props}/>)} />
            </Switch>
        </div>
    </BrowserRouter>
);

export default AppRouter;