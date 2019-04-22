import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from "react-redux";
import { Router, Route } from "react-router-dom";
import { history } from "./helpers/history";
import { PrivateRoute } from "./routes/indexRoutes";
import { store } from "./redux/storeConfig";
import Bootstrap from "./layouts/Bootstrap";
import IndexPage from "./layouts/IndexPage";

import "bootstrap/dist/css/bootstrap.css";
import "./assets/scss/index.scss";
import "./assets/css/pe-icon-7-stroke.css";

render(
    <Provider store={store}>
        <Router history={history}>
            <div>
                <PrivateRoute exact path="/" component={IndexPage} />
                <PrivateRoute path="/dashboard" component={IndexPage} />
                <PrivateRoute path="/pomodoro" component={IndexPage} />
                <PrivateRoute path="/report" component={IndexPage} />
                <Route path="/login" component={Bootstrap} />
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);