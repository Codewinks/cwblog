import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppPreview from './AppPreview';
import * as serviceWorker from './serviceWorker';
import {Auth0Provider} from "./context/Auth0";
import {AppProvider} from './context/App';
import config from "./auth_config.json";
import history from './history';
import {Router, Route, Switch} from "react-router-dom";
import NoMatch from "./views/errors/NoMatch";

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
    window.history.replaceState(
        {},
        document.title,
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
};

ReactDOM.render(
    <AppProvider>
        <Auth0Provider
            domain={config.domain}
            client_id={config.clientId}
            redirect_uri={window.location.origin}
            audience={config.audience}
            onRedirectCallback={onRedirectCallback}
        >
            <Router history={history}>
                <Switch>
                    <Route path="/preview" component={AppPreview} />
                    <Route path="/" component={App} />
                    <Route component={NoMatch} />
                </Switch>
            </Router>
        </Auth0Provider>
    </AppProvider>,
    document.getElementById("root")
);

serviceWorker.unregister();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
