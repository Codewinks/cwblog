import React, {useContext, useEffect, useState} from "react";
import {ALERT_ERROR, useApp} from "./App";
import createAuth0Client from "@auth0/auth0-spa-js";
import config from "../api_config.json";

const DEFAULT_REDIRECT_CALLBACK = () =>
    window.history.replaceState({}, document.title, window.location.pathname);

class ErrorResponse extends Error {
    constructor(response, data = {}) {
        super();
        this.response = response;
        this.status_code = response.status;
        this.message = 'error' in data ? data.error : 'A request error has occurred.';
    }
}

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
                                  children,
                                  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
                                  ...initOptions
                              }) => {
    const {showAlert} = useApp();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState();
    const [auth0Client, setAuth0] = useState();
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        const initAuth0 = async () => {
            const auth0FromHook = await createAuth0Client(initOptions);
            setAuth0(auth0FromHook);

            if (window.location.search.includes("code=")) {
                const {appState} = await auth0FromHook.handleRedirectCallback().catch(e => {
                    showAlert('error', 'Your session has expired.');
                    return false;
                });
                onRedirectCallback(appState);
            }

            const isAuthenticated = await auth0FromHook.isAuthenticated();

            setIsAuthenticated(isAuthenticated);
            // const user = await auth0FromHook.getUser();
            // console.log(user)

            if (isAuthenticated) {
                // const user = await auth0FromHook.getUser();
                try {
                    const user = await request('post', '/v1/auth/login', {}, auth0FromHook);
                    setCurrentUser(user);
                } catch (e) {
                    setIsAuthenticated(false);
                    console.error(e);
                    showAlert(ALERT_ERROR, 'There was a problem logging you in, please try again later.');
                    auth0FromHook.logout()
                }
            }

            setLoading(false);
        };

        initAuth0();
        // eslint-disable-next-line
    }, []);

    const request = async (method, endpoint, params = {}, client = null) => {
        client = client ? client : auth0Client;
        const token = await client.getTokenSilently();
        // console.log(`Bearer ${token}`);
        const response = await fetch(`${config.apiUrl}${endpoint}`, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: Object.entries(params).length ? JSON.stringify(params) : null
        });

        let data = {};
        try {
            data = await response.json();

            if (!response.ok) {
                throw new Error();
            }

            return data;
        } catch (e) {
            throw new ErrorResponse(response, data);
        }

    }

    const loginWithPopup = async (params = {}) => {
        setPopupOpen(true);
        try {
            await auth0Client.loginWithPopup(params);
        } catch (error) {
            console.error(error);
        } finally {
            setPopupOpen(false);
        }
        const user = await auth0Client.getUser();
        setCurrentUser(user);
        setIsAuthenticated(true);
    };

    const handleRedirectCallback = async () => {
        setLoading(true);
        await auth0Client.handleRedirectCallback();
        const user = await auth0Client.getUser();
        setIsAuthenticated(true);
        setCurrentUser(user);
        setLoading(false);
    };

    return (
        <Auth0Context.Provider
            value={{
                isAuthenticated,
                currentUser,
                loading,
                popupOpen,
                loginWithPopup,
                handleRedirectCallback,
                request,
                getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
                loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
                getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
                getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
                logout: (...p) => auth0Client.logout(...p)
            }}
        >
            {children}
        </Auth0Context.Provider>
    );
};