import React from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Main from '../Main/Main';
// import WordChainRoom from '../WordChainRoom/WordChainRoom'

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
                {/* <Route path="/:chainID" exact component={WordChainRoom} /> */}
            </Switch>
        </div>
    </BrowserRouter>
);

export default AppRouter;